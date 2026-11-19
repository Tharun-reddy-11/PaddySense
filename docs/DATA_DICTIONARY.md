# PaddySense Scientific Data Dictionary & Harmonization Architecture

## 1. Raw Data Sources

### A. Cowan et al. (2024) - IARI Indian Rice Field Gas Flux Dataset
- **Citation**: Cowan, N.; Bhatia, A.; Jain, N.; Drewer, J. (2024). *Experimental crop biomass and gas flux (methane, nitrous oxide, and ammonia) data from continuous and intermittently flooded rice fields under different fertiliser treatments, India, July-October, 2016*. NERC EDS Environmental Information Data Centre. DOI: [10.5285/46aafc00-6742-41df-b8be-09a8d5d86610](https://doi.org/10.5285/46aafc00-6742-41df-b8be-09a8d5d86610)
- **Measurement Method**: Static closed-chamber technique with gas chromatography (GC-FID for CH₄, GC-ECD for N₂O).
- **Location**: ICAR - Indian Agricultural Research Institute (IARI), New Delhi, India (Latitude 28.64° N, Longitude 77.16° E).
- **Temporal Coverage**: Kharif growing season (July - October 2016, 100+ days).
- **Regimes Measured**:
  - `CF`: Continuous Flooding (submerged 3-5 cm standing water until pre-harvest drainage).
  - `IF`: Intermittent Flooding / AWD (periodic dry periods between irrigation pulses).
- **Fertilizer Treatments**:
  - `CON`: Unfertilized Control (0 kg N/ha).
  - `FYM`: Farmyard Manure (Organic amendment, 60 kg N/ha equivalent).
  - `PRI`: Prilled Urea (120 kg N/ha standard broadcast in 3 splits).
  - `NCU`: Neem Coated Urea (120 kg N/ha slow-release broadcast in 3 splits).
  - `LCC`: Leaf Color Chart-guided Urea (need-based N application, ~90-100 kg N/ha).
- **Replication**: 3 independent experimental field replicates per treatment ($3 \times 5 \times 2 = 30$ experimental plot series).

### B. Gimje Daily Methane Flux Chamber Series (South Korea)
- **Measurement Method**: Automated daily closed chamber flux system.
- **Temporal Coverage**: 2022, 2023, 2024 rice growing seasons (Day After Transplanting 1 to 120).
- **Variables**: `DAT` (Day after transplanting), `tavg` (Air/water temp °C), `course_type` (Water regime), `ch4_flux` (Daily methane flux), `rain_mm` (Daily precipitation).

### C. Supporting Geospatial & Environmental Data
- **NASA POWER Agroclimatology**: Daily solar radiation ($MJ/m^2/day$), maximum/minimum air temperature ($^\circ C$), 2m relative humidity (%), precipitation ($mm$).
- **SoilGrids (ISRIC 250m)**: Bulk density, clay/sand/silt fraction, pH in H₂O, soil organic carbon (SOC) content.

---

## 2. Target Variable Definition & Scientific Unit Conversion

### Primary Target: Seasonal Methane Emission Intensity ($Y_{\text{CH}_4}$)
- **Unit**: $\text{kg CH}_4/\text{ha}/\text{season}$
- **Scientific Conversion Formula**:
  $$\text{Seasonal } \text{CH}_4 \, (\text{kg/ha/season}) = \left( \int_0^{T_{\text{season}}} \text{Flux}_{\text{daily}}(t) \, dt \right) \times \frac{10^4 \, \text{m}^2/\text{ha}}{10^6 \, \text{mg/kg}} = \sum_{t=1}^{T} \text{Flux}(t) \times 0.01$$
  where $\text{Flux}(t)$ is daily chamber methane flux in $\text{mg CH}_4/\text{m}^2/\text{day}$.

### Secondary Target: Methane Emission Risk Category
Validated agro-ecological thresholds aligned with IPCC Tier 2 paddy benchmarks:
- **Low Risk**: $< 100 \text{ kg CH}_4/\text{ha}/\text{season}$
- **Moderate Risk**: $100 \text{ to } 180 \text{ kg CH}_4/\text{ha}/\text{season}$
- **High Risk**: $180 \text{ to } 280 \text{ kg CH}_4/\text{ha}/\text{season}$
- **Very High Risk**: $> 280 \text{ kg CH}_4/\text{ha}/\text{season}$

---

## 3. Input Features & Model Schema

| Feature Name | Type | Physical Range | Typical Value | Source / Method |
|:---|:---:|:---:|:---:|:---|
| `soil_ph` | Numeric | 4.5 – 9.0 | 7.9 – 8.2 | Laboratory measurement or SoilGrids |
| `soil_organic_carbon_pct` | Numeric | 0.2 – 6.0 % | 0.8 – 4.5 % | Laboratory measurement / Walkley-Black |
| `soil_nitrogen_pct` | Numeric | 0.05 – 1.0 % | 0.25 – 0.35 % | Kjeldahl total N |
| `soil_texture` | Categorical | Sand, Loam, Clay, Sandy Loam, Silty Clay, Clay Loam | Sandy Loam / Clay Loam | Soil classification / USDA |
| `bulk_density_g_cm3` | Numeric | 1.1 – 1.7 g/cm³ | 1.35 – 1.45 g/cm³ | Core sampler method |
| `water_management_method` | Categorical | Continuous Flooding, Alternate Wetting and Drying (AWD), Intermittent Flooding, Rainfed | Continuous Flooding | Farmer management log |
| `flooding_duration_days` | Numeric | 0 – 140 days | 40 – 90 days | Farmer water log |
| `drying_duration_days` | Numeric | 0 – 60 days | 0 – 25 days | Farmer aeration log |
| `water_depth_cm` | Numeric | 0 – 25 cm | 2 – 7 cm | Piezometer / field ruler |
| `irrigation_frequency_season` | Numeric | 1 – 30 events | 10 – 18 events | Irrigation schedule |
| `nitrogen_fertilizer_kg_ha` | Numeric | 0 – 300 kg N/ha | 90 – 150 kg N/ha | Fertilizer management log |
| `fertilizer_type` | Categorical | Urea, Neem Coated Urea, Ammonium Sulphate, Organic/FYM, DAP | Neem Coated Urea | Farm inputs record |
| `fertilizer_application_method`| Categorical | Broadcasting, Deep Placement, Split Application (LCC) | Split Application | Application method |
| `straw_residue_management` | Categorical | Incorporated, Retained/Mulched, Removed, Burned, Composted | Incorporated | Crop residue log |
| `straw_residue_kg_ha` | Numeric | 0 – 6000 kg/ha | 1000 – 2500 kg/ha | Harvest residue weight |
| `rice_variety_group` | Categorical | Semi-dwarf High Yielding, Hybrid, Traditional Tall | Semi-dwarf High Yielding | Seed certification / Variety |
| `crop_duration_days` | Numeric | 80 – 180 days | 105 – 135 days | Sowing to harvest duration |
| `avg_temperature_c` | Numeric | 15.0 – 42.0 °C | 28.0 – 33.0 °C | Daily NASA POWER / local weather |
| `total_rainfall_mm` | Numeric | 50 – 2500 mm | 400 – 1100 mm | Daily NASA POWER / rain gauge |
| `relative_humidity_pct` | Numeric | 25 – 98 % | 60 – 85 % | Weather station / NASA POWER |

---

## 4. Leakage Prevention & Validation Hierarchy
1. **Group Split by Field / Site**: All replicates belonging to an experimental trial remain grouped within the same cross-validation fold.
2. **Preprocessing Pipeline Serialization**: Missing-value imputers, Scalers, and Target Encoders are fit strictly on training splits and evaluated on unseen validation splits.
3. **No Synthetic Training Data**: Baseline metrics are evaluated exclusively on genuine field measurement records.
