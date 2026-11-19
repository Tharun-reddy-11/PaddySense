"""
Unit Tests for PaddySense FastAPI ML Microservice
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "UP"
    print("Test Health Passed:", data)

def test_model_info():
    res = client.get("/model/info")
    assert res.status_code == 200
    data = res.json()
    assert "model_name" in data
    assert "selected_algorithm" in data
    print("Test Model Info Passed. Selected Algorithm:", data["selected_algorithm"])

def test_predict():
    payload = {
        "field_name": "Test North Field",
        "latitude": 28.64,
        "longitude": 77.16,
        "soil_ph": 7.9,
        "soil_organic_carbon_pct": 0.85,
        "soil_nitrogen_pct": 0.22,
        "soil_texture": "Clay Loam",
        "bulk_density_g_cm3": 1.38,
        "water_management_method": "Continuous Flooding",
        "flooding_duration_days": 85.0,
        "drying_duration_days": 10.0,
        "water_depth_cm": 5.0,
        "irrigation_frequency_season": 16,
        "nitrogen_fertilizer_kg_ha": 120.0,
        "fertilizer_type": "Neem Coated Urea",
        "fertilizer_application_method": "Broadcasting",
        "fertilizer_split_count": 3,
        "straw_residue_management": "Incorporated",
        "straw_residue_kg_ha": 1800.0,
        "rice_variety_group": "Semi-dwarf High Yielding",
        "crop_duration_days": 115,
        "planting_method": "Transplanted",
        "avg_temperature_c": 29.5,
        "total_rainfall_mm": 980.0,
        "relative_humidity_pct": 72.0
    }
    res = client.post("/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "estimated_seasonal_ch4_kg_ha" in data
    assert "risk_category" in data
    assert "top_contributing_factors" in data
    assert "uncertainty_90" in data
    print(f"Test Predict Passed: {data['estimated_seasonal_ch4_kg_ha']} {data['unit']}, Risk: {data['risk_category']}")

def test_scenario():
    current = {
        "water_management_method": "Continuous Flooding",
        "flooding_duration_days": 85.0,
        "drying_duration_days": 10.0,
        "nitrogen_fertilizer_kg_ha": 120.0,
        "soil_ph": 7.9,
        "soil_organic_carbon_pct": 0.85,
        "soil_nitrogen_pct": 0.22,
        "soil_texture": "Clay Loam",
        "bulk_density_g_cm3": 1.38,
        "water_depth_cm": 5.0,
        "irrigation_frequency_season": 16,
        "fertilizer_type": "Neem Coated Urea",
        "fertilizer_application_method": "Broadcasting",
        "fertilizer_split_count": 3,
        "straw_residue_management": "Incorporated",
        "straw_residue_kg_ha": 1800.0,
        "rice_variety_group": "Semi-dwarf High Yielding",
        "crop_duration_days": 115,
        "planting_method": "Transplanted",
        "avg_temperature_c": 29.5,
        "total_rainfall_mm": 980.0,
        "relative_humidity_pct": 72.0
    }
    alternative = dict(current)
    alternative["water_management_method"] = "Alternate Wetting and Drying (AWD)"
    alternative["flooding_duration_days"] = 45.0
    alternative["drying_duration_days"] = 30.0
    alternative["nitrogen_fertilizer_kg_ha"] = 100.0

    payload = {
        "current_practice": current,
        "alternative_scenario": alternative
    }
    res = client.post("/scenario/compare", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "emission_difference_kg_ha" in data
    print(f"Test Scenario Compare Passed: Current={data['current_emission_kg_ha']}, Alt={data['alternative_emission_kg_ha']}, Diff={data['emission_difference_kg_ha']}")

if __name__ == "__main__":
    test_health()
    test_model_info()
    test_predict()
    test_scenario()
    print("\nALL FASTAPI TESTS PASSED SUCCESSFULLY!")
