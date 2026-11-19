package com.paddysense.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "assessment_inputs")
public class AssessmentInput {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false, unique = true)
    private Assessment assessment;

    // Soil
    private Double soilPh;
    private Double soilOrganicCarbonPct;
    private Double soilNitrogenPct;
    private String soilTexture;
    private Double bulkDensityGCm3;

    // Water & Irrigation
    private String waterManagementMethod;
    private Double floodingDurationDays;
    private Double dryingDurationDays;
    private Double waterDepthCm;
    private Integer irrigationFrequencySeason;

    // Fertilizer
    private Double nitrogenFertilizerKgHa;
    private String fertilizerType;
    private String fertilizerApplicationMethod;
    private Integer fertilizerSplitCount;

    // Residue & Crop
    private String strawResidueManagement;
    private Double strawResidueKgHa;
    private String riceVarietyGroup;
    private Integer cropDurationDays;
    private String plantingMethod;

    // Weather & Climate
    private Double avgTemperatureC;
    private Double totalRainfallMm;
    private Double relativeHumidityPct;

    public AssessmentInput() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }

    public Double getSoilPh() { return soilPh; }
    public void setSoilPh(Double soilPh) { this.soilPh = soilPh; }

    public Double getSoilOrganicCarbonPct() { return soilOrganicCarbonPct; }
    public void setSoilOrganicCarbonPct(Double soilOrganicCarbonPct) { this.soilOrganicCarbonPct = soilOrganicCarbonPct; }

    public Double getSoilNitrogenPct() { return soilNitrogenPct; }
    public void setSoilNitrogenPct(Double soilNitrogenPct) { this.soilNitrogenPct = soilNitrogenPct; }

    public String getSoilTexture() { return soilTexture; }
    public void setSoilTexture(String soilTexture) { this.soilTexture = soilTexture; }

    public Double getBulkDensityGCm3() { return bulkDensityGCm3; }
    public void setBulkDensityGCm3(Double bulkDensityGCm3) { this.bulkDensityGCm3 = bulkDensityGCm3; }

    public String getWaterManagementMethod() { return waterManagementMethod; }
    public void setWaterManagementMethod(String waterManagementMethod) { this.waterManagementMethod = waterManagementMethod; }

    public Double getFloodingDurationDays() { return floodingDurationDays; }
    public void setFloodingDurationDays(Double floodingDurationDays) { this.floodingDurationDays = floodingDurationDays; }

    public Double getDryingDurationDays() { return dryingDurationDays; }
    public void setDryingDurationDays(Double dryingDurationDays) { this.dryingDurationDays = dryingDurationDays; }

    public Double getWaterDepthCm() { return waterDepthCm; }
    public void setWaterDepthCm(Double waterDepthCm) { this.waterDepthCm = waterDepthCm; }

    public Integer getIrrigationFrequencySeason() { return irrigationFrequencySeason; }
    public void setIrrigationFrequencySeason(Integer irrigationFrequencySeason) { this.irrigationFrequencySeason = irrigationFrequencySeason; }

    public Double getNitrogenFertilizerKgHa() { return nitrogenFertilizerKgHa; }
    public void setNitrogenFertilizerKgHa(Double nitrogenFertilizerKgHa) { this.nitrogenFertilizerKgHa = nitrogenFertilizerKgHa; }

    public String getFertilizerType() { return fertilizerType; }
    public void setFertilizerType(String fertilizerType) { this.fertilizerType = fertilizerType; }

    public String getFertilizerApplicationMethod() { return fertilizerApplicationMethod; }
    public void setFertilizerApplicationMethod(String fertilizerApplicationMethod) { this.fertilizerApplicationMethod = fertilizerApplicationMethod; }

    public Integer getFertilizerSplitCount() { return fertilizerSplitCount; }
    public void setFertilizerSplitCount(Integer fertilizerSplitCount) { this.fertilizerSplitCount = fertilizerSplitCount; }

    public String getStrawResidueManagement() { return strawResidueManagement; }
    public void setStrawResidueManagement(String strawResidueManagement) { this.strawResidueManagement = strawResidueManagement; }

    public Double getStrawResidueKgHa() { return strawResidueKgHa; }
    public void setStrawResidueKgHa(Double strawResidueKgHa) { this.strawResidueKgHa = strawResidueKgHa; }

    public String getRiceVarietyGroup() { return riceVarietyGroup; }
    public void setRiceVarietyGroup(String riceVarietyGroup) { this.riceVarietyGroup = riceVarietyGroup; }

    public Integer getCropDurationDays() { return cropDurationDays; }
    public void setCropDurationDays(Integer cropDurationDays) { this.cropDurationDays = cropDurationDays; }

    public String getPlantingMethod() { return plantingMethod; }
    public void setPlantingMethod(String plantingMethod) { this.plantingMethod = plantingMethod; }

    public Double getAvgTemperatureC() { return avgTemperatureC; }
    public void setAvgTemperatureC(Double avgTemperatureC) { this.avgTemperatureC = avgTemperatureC; }

    public Double getTotalRainfallMm() { return totalRainfallMm; }
    public void setTotalRainfallMm(Double totalRainfallMm) { this.totalRainfallMm = totalRainfallMm; }

    public Double getRelativeHumidityPct() { return relativeHumidityPct; }
    public void setRelativeHumidityPct(Double relativeHumidityPct) { this.relativeHumidityPct = relativeHumidityPct; }
}
