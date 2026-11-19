# PaddySense – AI-Based Methane Emission Estimation for Sustainable Paddy Cultivation

> **Taglines:** *"Smarter Insights. Sustainable Rice Cultivation."* | *"Smart Insights. Healthy Harvest."*

---

## 🌾 1. Executive Summary & Research Foundation

**PaddySense** is an enterprise-grade, full-stack decision-support platform designed to quantify, explain, and mitigate seasonal methane ($\text{CH}_4$) emissions from flooded paddy rice fields. 

The application is grounded in and substantially advances beyond the scientific foundation established in:
> **"Uncovering drivers and mitigation synergies of global paddy CH₄ and N₂O emissions using a Bayesian Belief Network"**  
> *Journal of Cleaner Production, Volume 554 (2026), Article 147994.*

### 🚀 Key Scientific Improvements Over the Base Paper:
1. **Continuous Quantitative Emission Intensity ($\text{kg CH}_4/\text{ha}/\text{season}$)**:
   - Rather than coarse discretized probabilistic bins, PaddySense estimates continuous cumulative seasonal flux using a site-stratified machine learning regressor.
2. **Leakage-Free Validation via 5-Fold Site-Stratified `GroupKFold`**:
   - Observations from the same experimental site/season are strictly isolated, preventing spatial autocorrelation leakage.
3. **Daily Location-Aware Climatology (NASA POWER Integration)**:
   - Seamlessly fetches site-specific daily solar irradiance, growing season temperatures, and cumulative precipitation.
4. **Local Feature Explainability (TreeSHAP)**:
   - Provides exact local additive feature attributions demonstrating how each farmer practice pushes emissions above or below regional baseline ($E[f(x)] = 501.5\text{ kg/ha}$).
5. **Conformal Uncertainty Intervals ($90\%$ and $95\%$)**:
   - Delivers rigorous non-parametric confidence bands calculated on held-out chamber flux measurements.
6. **Actionable Climate-Smart Agronomy with $N_2O$ Trade-Off Safeguards**:
   - Implements Alternate Wetting and Drying (AWD) pani-pipe protocols alongside leaf-color-chart (LCC) synchronized split nitrogen timing to avoid unintended nitrification-denitrification nitrous oxide spikes.

---

## 🏛️ 2. High-Level System Architecture

PaddySense is engineered with a modular, decoupled microservice architecture:

```
                                  ┌─────────────────────────────┐
                                  │      React.js + Vite        │
                                  │   Agricultural UI/UX        │
                                  │     (Port 5173 / Web)       │
                                  └──────────────┬──────────────┘
                                                 │ HTTP / REST
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │    Java Spring Boot 3.4.5   │
                                  │       Enterprise API        │
                                  │     (Port 8080 / JWT Auth)  │
                                  └──────┬───────────────┬──────┘
                                         │               │
                        JPA / Hibernate  │               │ Internal REST Proxy
                                         ▼               ▼
                   ┌───────────────────────────┐   ┌─────────────────────────────┐
                   │    MySQL 8.0 Database     │   │     Python FastAPI 3.12     │
                   │      paddysense_db        │   │    ML Inference Engine      │
                   │       (Port 3306)         │   │   (Port 8000 / XGBoost)     │
                   └───────────────────────────┘   └─────────────────────────────┘
```

### Component Details:
- **Frontend (`/frontend`)**:
  - React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Leaflet.
  - Farmer-centric design system featuring a 4-card 5-second auto-rotating visual carousel, 6-step assessment wizard, and interactive what-if scenario simulator.
- **Backend API (`/backend`)**:
  - Java 23, Spring Boot 3.4.5, Spring Security 6 with stateless JWT authentication, Spring Data JPA, Hibernate, Maven.
- **Machine Learning Microservice (`/ml-service`)**:
  - Python 3.12.14, FastAPI, Scikit-learn, XGBoost, CatBoost, LightGBM, SHAP, Joblib, Pydantic.
- **Relational Database (`paddysense_db`)**:
  - MySQL Server 8.0 with normalized schema storing users, fields, assessment inputs, predictions, SHAP explanations, and recommendations.

---

## 📊 3. Machine Learning Benchmark & Validation

Five regression models were rigorously benchmarked on the harmonized field dataset (ICAR-IARI static chamber flux and Gimje daily chamber series) using **5-Fold Site-Stratified `GroupKFold`** on `site_id`:

| Model Architecture | Spatial Test MAE ($\text{kg/ha}$) | Spatial Test RMSE ($\text{kg/ha}$) | Spatial Test $R^2$ Score | Selection Status |
| :--- | :---: | :---: | :---: | :---: |
| **Linear Regression (Baseline)** | 366.77 | 687.31 | -2.0016 | Baseline |
| **Random Forest Regressor** | 115.78 | 153.50 | 0.8503 | Candidate |
| **XGBoost Regressor** | **116.81** | **153.31** | **0.8506** | 🏆 **Selected Production Model** |
| **CatBoost Regressor** | 135.27 | 169.38 | 0.8177 | Candidate |
| **LightGBM Regressor** | 186.36 | 277.47 | 0.5108 | Candidate |

### Model Artifacts (`/models`):
- `best_methane_regressor.joblib`: Serialized tuned XGBoost Regressor pipeline.
- `calibrated_risk_classifier.joblib`: Isotonically calibrated multi-class classifier (Low, Moderate, High, Very High).
- `uncertainty_calibrator.joblib`: Split-conformal residual distributions ($90\%$ margin: $\pm 236.0\text{ kg/ha}$, $95\%$ margin: $\pm 277.8\text{ kg/ha}$).
- `shap_explainer_data.joblib`: Background data and TreeSHAP explainer for instant additive attribution.
- `model_metadata.json`: Full training provenance, hyperparameters, and cross-validation metrics.

---

## ⚡ 4. Rapid Start Guide

### Prerequisites:
1. **MySQL Server 8.0** running on `localhost:3306` with database `paddysense_db`.
2. **Java 17+ / JDK 23** installed and in `PATH`.
3. **Python 3.12** environment with installed packages in `.venv`.
4. **Node.js 18+** with `npm`.

### One-Click Launch (All Services):
Double-click `start_all.bat` in the root project directory:
```powershell
D:\Projects\PaddySense\start_all.bat
```
This script launches:
1. Python FastAPI on `http://localhost:8000` (Interactive Swagger Docs: `http://localhost:8000/docs`)
2. Spring Boot Backend on `http://localhost:8080`
3. React Vite Web UI on `http://localhost:5173`

---

## 🔌 5. REST API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register`: Register new farmer account.
- `POST /api/auth/login`: Authenticate and receive JWT Bearer token.
- `GET /api/auth/profile`: Get logged-in farmer profile.
- `PUT /api/auth/profile`: Update farmer location, contact, and preferred reporting units.

### 🌱 Fields Management (`/api/fields`)
- `GET /api/fields`: List all registered fields for farmer.
- `POST /api/fields`: Register a new paddy field with coordinates and soil baseline.
- `PUT /api/fields/{id}`: Update field characteristics.
- `DELETE /api/fields/{id}`: Delete field and historical records.

### 📈 Methane Assessment & Prediction (`/api/assessments`)
- `GET /api/assessments`: List all historical assessments.
- `GET /api/assessments/{id}`: Get full assessment diagnosis including continuous emission estimate, risk probabilities, TreeSHAP waterfall values, and conformal bounds.
- `POST /api/assessments`: Submit 6-step assessment wizard data and trigger real-time ML inference.

### 🔮 What-If Scenario Comparison (`/api/scenarios`)
- `POST /api/scenarios/compare`: Simulate agronomic practice interventions (AWD, split N, straw composting) against current baseline and calculate net emission reduction with $N_2O$ warnings.
- `GET /api/scenarios/assessment/{assessmentId}`: Retrieve saved scenario simulations for an assessment.

### 📊 Analytics & Notifications (`/api/analytics`, `/api/notifications`)
- `GET /api/analytics/overview`: Aggregated farm statistics, risk class distributions, and multi-season trend series.
- `GET /api/notifications`: Retrieve in-app farmer alerts and seasonal reminders.
- `PUT /api/notifications/{id}/read`: Mark notification as read.

---

## 📄 6. Data Integrity & Scientific Disclaimer

Methane emission intensities generated by PaddySense represent empirical statistical predictions derived from static closed-chamber research observations and should be treated as decision-support guidance. Farmers and extension officers should verify localized hydrological and soil conditions prior to implementing water drainage or altering nitrogen fertilizer regimes.
