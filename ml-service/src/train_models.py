"""
PaddySense - Machine Learning Training, Benchmarking & Interpretability Pipeline
==============================================================================
- Preprocessing with ColumnTransformer (imputation, scaling, one-hot encoding)
- GroupKFold spatial validation to prevent plot-level data leakage
- Benchmarks: Linear Regression, Random Forest, XGBoost, CatBoost, LightGBM
- Metrics: MAE, RMSE, R2
- Calibrated Multi-Class Classifier for Risk Probabilities (Low, Moderate, High, Very High)
- TreeSHAP feature explanations
- Conformal Prediction uncertainty intervals
- Artifact serialization to D:\Projects\PaddySense\models
"""

import os
import json
import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import GroupKFold
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.metrics import accuracy_score, f1_score, classification_report

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from xgboost import XGBRegressor
from catboost import CatBoostRegressor
from lightgbm import LGBMRegressor
from sklearn.calibration import CalibratedClassifierCV
import shap

PROCESSED_DATA_PATH = r"D:\Projects\PaddySense\datasets\processed\paddy_methane_harmonized_dataset.csv"
MODELS_DIR = r"D:\Projects\PaddySense\models"
EVAL_DIR = r"D:\Projects\PaddySense\evaluation"
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(EVAL_DIR, exist_ok=True)

NUMERIC_FEATURES = [
    'soil_organic_carbon_pct',
    'soil_ph',
    'soil_nitrogen_pct',
    'bulk_density_g_cm3',
    'flooding_duration_days',
    'drying_duration_days',
    'water_depth_cm',
    'irrigation_frequency_season',
    'nitrogen_fertilizer_kg_ha',
    'fertilizer_split_count',
    'straw_residue_kg_ha',
    'crop_duration_days',
    'avg_temperature_c',
    'total_rainfall_mm',
    'relative_humidity_pct'
]

CATEGORICAL_FEATURES = [
    'soil_texture',
    'water_management_method',
    'fertilizer_type',
    'fertilizer_application_method',
    'straw_residue_management',
    'rice_variety_group',
    'planting_method'
]

ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES
TARGET_REGRESSION = 'seasonal_methane_kg_ha'
TARGET_CLASSIFICATION = 'emission_risk_category'
RISK_CLASSES = ['Low', 'Moderate', 'High', 'Very High']

def build_preprocessor():
    num_transformer = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    cat_transformer = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    preprocessor = ColumnTransformer([
        ('num', num_transformer, NUMERIC_FEATURES),
        ('cat', cat_transformer, CATEGORICAL_FEATURES)
    ])
    return preprocessor

def evaluate_models():
    print("=" * 70)
    print("PADDYSENSE: MODEL BENCHMARKING & VALIDATION PIPELINE")
    print("=" * 70)

    df = pd.read_csv(PROCESSED_DATA_PATH)
    print(f"Loaded dataset: {len(df)} rows, {len(ALL_FEATURES)} input features")

    X = df[ALL_FEATURES]
    y_reg = df[TARGET_REGRESSION].values
    y_clf = df[TARGET_CLASSIFICATION].values
    groups = df['site_id'].values

    # Candidate Regressors
    candidate_regressors = {
        'Linear Regression (Baseline)': LinearRegression(),
        'Random Forest Regressor': RandomForestRegressor(n_estimators=120, max_depth=8, random_state=42),
        'XGBoost Regressor': XGBRegressor(n_estimators=120, learning_rate=0.06, max_depth=4, random_state=42),
        'CatBoost Regressor': CatBoostRegressor(iterations=150, learning_rate=0.06, depth=4, verbose=0, random_seed=42),
        'LightGBM Regressor': LGBMRegressor(n_estimators=120, learning_rate=0.06, max_depth=4, random_state=42, verbose=-1)
    }

    # 5-Fold Group Validation (Stratified by Site to prevent plot leakage)
    n_splits = min(5, len(np.unique(groups)))
    gkf = GroupKFold(n_splits=n_splits)

    benchmark_results = {}
    oof_predictions = {name: np.zeros(len(df)) for name in candidate_regressors}

    print(f"\nRunning {n_splits}-Fold Site-Stratified Group Validation...")
    print(f"{'Algorithm':<30} | {'MAE (kg/ha)':<12} | {'RMSE (kg/ha)':<12} | {'R2 Score':<10}")
    print("-" * 72)

    for name, model in candidate_regressors.items():
        oof_preds = np.zeros(len(df))
        
        for train_idx, val_idx in gkf.split(X, y_reg, groups):
            X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
            y_train, y_val = y_reg[train_idx], y_reg[val_idx]

            prep = build_preprocessor()
            X_train_proc = prep.fit_transform(X_train)
            X_val_proc = prep.transform(X_val)

            model.fit(X_train_proc, y_train)
            oof_preds[val_idx] = model.predict(X_val_proc)

        oof_predictions[name] = oof_preds
        mae = float(mean_absolute_error(y_reg, oof_preds))
        rmse = float(np.sqrt(mean_squared_error(y_reg, oof_preds)))
        r2 = float(r2_score(y_reg, oof_preds))

        benchmark_results[name] = {
            'MAE': round(mae, 2),
            'RMSE': round(rmse, 2),
            'R2': round(r2, 4)
        }
        print(f"{name:<30} | {mae:<12.2f} | {rmse:<12.2f} | {r2:<10.4f}")

    # Select Best Regressor by lowest RMSE
    best_name = min(benchmark_results, key=lambda k: benchmark_results[k]['RMSE'])
    print(f"\nSelected Best Continuous Regressor: {best_name}")
    print(f"Validation Metrics: MAE={benchmark_results[best_name]['MAE']}, RMSE={benchmark_results[best_name]['RMSE']}, R2={benchmark_results[best_name]['R2']}")

    # Fit final preprocessor and final best model on all data
    final_preprocessor = build_preprocessor()
    X_processed = final_preprocessor.fit_transform(X)

    best_model_instance = candidate_regressors[best_name]
    best_model_instance.fit(X_processed, y_reg)

    # -------------------------------------------------------------
    # Calibrated Risk Classifier
    # -------------------------------------------------------------
    print("\nTraining Calibrated Multi-Class Risk Classifier...")
    base_clf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    calibrated_clf = CalibratedClassifierCV(estimator=base_clf, method='sigmoid', cv=3)
    calibrated_clf.fit(X_processed, y_clf)

    y_clf_pred = calibrated_clf.predict(X_processed)
    clf_acc = float(accuracy_score(y_clf, y_clf_pred))
    clf_f1 = float(f1_score(y_clf, y_clf_pred, average='macro'))
    print(f"Calibrated Classifier Training Accuracy: {clf_acc:.4f}, Macro-F1: {clf_f1:.4f}")

    # -------------------------------------------------------------
    # Conformal Uncertainty Calibration
    # -------------------------------------------------------------
    # Use residuals from out-of-fold predictions to establish distribution-free intervals
    best_oof_preds = oof_predictions[best_name]
    residuals = np.abs(y_reg - best_oof_preds)
    q90 = float(np.quantile(residuals, 0.90))
    q95 = float(np.quantile(residuals, 0.95))
    print(f"\nConformal Uncertainty Residuals:")
    print(f"90% Prediction Interval Half-Width: +/- {q90:.2f} kg CH4/ha/season")
    print(f"95% Prediction Interval Half-Width: +/- {q95:.2f} kg CH4/ha/season")

    uncertainty_calibrator = {
        'method': 'Conformal Prediction (OOF Absolute Residuals)',
        'q90': round(q90, 2),
        'q95': round(q95, 2),
        'sample_size': len(y_reg)
    }

    # -------------------------------------------------------------
    # SHAP Explainer Setup
    # -------------------------------------------------------------
    print("\nInitializing TreeSHAP Explainer...")
    # Get feature names after one-hot encoding
    encoded_cat_features = list(final_preprocessor.named_transformers_['cat'].named_steps['encoder'].get_feature_names_out(CATEGORICAL_FEATURES))
    feature_names_processed = NUMERIC_FEATURES + encoded_cat_features

    # Create TreeExplainer on best model
    try:
        explainer = shap.TreeExplainer(best_model_instance)
        shap_values = explainer.shap_values(X_processed)
        expected_value = float(explainer.expected_value) if np.isscalar(explainer.expected_value) else float(explainer.expected_value[0])
    except Exception as e:
        print(f"TreeExplainer fallback: {e}")
        explainer = shap.Explainer(best_model_instance, X_processed[:50])
        shap_values = explainer(X_processed).values
        expected_value = float(np.mean(y_reg))

    print(f"Base/Expected Value: {expected_value:.2f} kg CH4/ha/season")

    # Global feature importance from mean absolute SHAP values
    mean_abs_shap = np.mean(np.abs(shap_values), axis=0)
    top_feature_indices = np.argsort(mean_abs_shap)[::-1][:10]
    top_features_summary = [
        {
            'feature': feature_names_processed[i],
            'importance_score': round(float(mean_abs_shap[i]), 2)
        }
        for i in top_feature_indices
    ]
    print(f"Top 5 Influential Drivers (Global TreeSHAP):")
    for item in top_features_summary[:5]:
        print(f" - {item['feature']}: {item['importance_score']}")

    # -------------------------------------------------------------
    # Save Artifacts
    # -------------------------------------------------------------
    regressor_path = os.path.join(MODELS_DIR, "best_methane_regressor.joblib")
    classifier_path = os.path.join(MODELS_DIR, "calibrated_risk_classifier.joblib")
    pipeline_path = os.path.join(MODELS_DIR, "preprocessing_pipeline.joblib")
    uncertainty_path = os.path.join(MODELS_DIR, "uncertainty_calibrator.joblib")
    shap_data_path = os.path.join(MODELS_DIR, "shap_explainer_data.joblib")
    metadata_path = os.path.join(MODELS_DIR, "model_metadata.json")

    joblib.dump(best_model_instance, regressor_path)
    joblib.dump(calibrated_clf, classifier_path)
    joblib.dump(final_preprocessor, pipeline_path)
    joblib.dump(uncertainty_calibrator, uncertainty_path)
    
    # Save SHAP explainer and background reference
    shap_artifact = {
        'expected_value': expected_value,
        'feature_names_processed': feature_names_processed,
        'background_samples': X_processed[:50].tolist(),
        'top_global_drivers': top_features_summary
    }
    joblib.dump(shap_artifact, shap_data_path)

    metadata = {
        'model_name': 'PaddySense Methane Estimation Engine',
        'model_version': '1.0.0-PROD',
        'selected_algorithm': best_name,
        'benchmark_comparison': benchmark_results,
        'target_variable': 'Seasonal Methane Emission Intensity (kg CH4/ha/season)',
        'target_units': 'kg CH4/ha/season',
        'validation_strategy': f'{n_splits}-Fold Site-Stratified GroupKFold (Leakage-Proof)',
        'total_training_samples': len(df),
        'unique_experimental_sites': len(np.unique(groups)),
        'numeric_features': NUMERIC_FEATURES,
        'categorical_features': CATEGORICAL_FEATURES,
        'processed_feature_count': len(feature_names_processed),
        'calibrated_classifier_accuracy': round(clf_acc, 4),
        'calibrated_classifier_macro_f1': round(clf_f1, 4),
        'uncertainty_90_half_width': round(q90, 2),
        'uncertainty_95_half_width': round(q95, 2),
        'risk_thresholds': {
            'Low': '< 100 kg CH4/ha/season',
            'Moderate': '100 - 180 kg CH4/ha/season',
            'High': '180 - 280 kg CH4/ha/season',
            'Very High': '> 280 kg CH4/ha/season'
        },
        'disclaimers': [
            'TreeSHAP feature attributions describe model predictive associations and do not prove causal agronomic effects.',
            'Alternate Wetting and Drying (AWD) reduces methane emissions but can elevate nitrous oxide (N2O) emissions in certain soils.'
        ]
    }

    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)

    with open(os.path.join(EVAL_DIR, "benchmark_report.json"), 'w') as f:
        json.dump(benchmark_results, f, indent=2)

    print(f"\nAll model artifacts successfully serialized to {MODELS_DIR}")
    print("=" * 70)
    return metadata

if __name__ == '__main__':
    evaluate_models()
