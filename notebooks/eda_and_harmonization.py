"""
PaddySense - EDA, Data Harmonization and Target Integration Pipeline
===================================================================
Inspects raw experimental datasets:
1. Cowan et al. (2024) IARI Indian Rice Field Gas Flux Dataset (Continuous vs Intermittent Flooding, N-fertilizers)
2. Gimje Daily Methane Chamber Flux Series (Flooding vs Aeration regimes)
3. Literature-grounded field observations for external multi-site validation

Harmonizes units:
- Daily flux (mg CH4/m^2/day or g CH4/m^2/day) -> Cumulative Seasonal Intensity (kg CH4/ha/season)
- Preserves genuine measured fluxes, dates, treatments, and soil parameters.
"""

import os
import glob
import pandas as pd
import numpy as np

DATA_DIR = r"D:\Projects\PaddySense\datasets\data"
CH4_DIR = r"D:\Projects\PaddySense\datasets\ch4"
PROCESSED_DIR = r"D:\Projects\PaddySense\datasets\processed"
os.makedirs(PROCESSED_DIR, exist_ok=True)

print("=" * 70)
print("PADDYSENSE: DATASET INSPECTION & HARMONIZATION PIPELINE")
print("=" * 70)

# 1. Inspect Cowan et al. (2024) IARI Dataset
n2o_ch4_path = os.path.join(DATA_DIR, "n2o_ch4.csv")
site_path = os.path.join(DATA_DIR, "site_properties.csv")
weather_path = os.path.join(DATA_DIR, "weather.csv")
irr_path = os.path.join(DATA_DIR, "irrigation.csv")
crop_path = os.path.join(DATA_DIR, "crop_biomass_n.csv")

df_flux = pd.read_csv(n2o_ch4_path)
print(f"IARI Flux Records: {len(df_flux)} rows")
print(f"Columns: {list(df_flux.columns)}")
print(f"Irrigation regimes: {df_flux['irrigation'].unique()}")
print(f"Treatments: {df_flux['Treatment'].unique()}")
print(f"CH4_Flux min: {df_flux['CH4_Flux'].min():.2f}, max: {df_flux['CH4_Flux'].max():.2f}, mean: {df_flux['CH4_Flux'].mean():.2f}")

# 2. Inspect Site Properties
df_site = pd.read_csv(site_path)
print(f"\nSite Properties Records: {len(df_site)} rows")
print(f"Columns: {list(df_site.columns)}")

# 3. Inspect Weather
df_weather = pd.read_csv(weather_path)
print(f"\nWeather Records: {len(df_weather)} rows")
print(f"Weather date range: {df_weather['Date'].min()} to {df_weather['Date'].max()}")
print(f"Mean temp: {df_weather['Tmean'].mean():.2f} C, Total Rain: {df_weather['Rainfall'].sum():.2f} mm")

# 4. Inspect Gimje Daily CH4 files
gimje_files = glob.glob(os.path.join(CH4_DIR, "GJ*.csv"))
print(f"\nGimje Daily CH4 Files: {len(gimje_files)} files found")
if gimje_files:
    sample_gimje = pd.read_csv(gimje_files[0])
    print(f"Sample Gimje shape: {sample_gimje.shape}, columns: {list(sample_gimje.columns)}")

print("\nReady for integration and seasonal aggregation.")
