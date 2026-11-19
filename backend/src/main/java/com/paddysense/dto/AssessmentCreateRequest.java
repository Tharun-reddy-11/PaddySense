package com.paddysense.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

public class AssessmentCreateRequest {
    private Long fieldId;
    private String season;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate plantingDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate expectedHarvestDate;

    // Soil Parameters
    private Double soilPh;
    private Double soilOrganicCarbonPct;
    private Double soilNitrogenPct;
    private String soilTexture;
    private Double bulkDensityGCm3;

    // Water Management
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

    // Weather
    private Double avgTemperatureC;
    private Double totalRainfallMm;
    private Double relativeHumidityPct;

    public AssessmentCreateRequest() {}

    // Getters and Setters
    public Long getFieldId() { return fieldId; }
    public void setFieldId(Long fieldId) { this.fieldId = fieldId; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    public LocalDate getPlantingDate() { return plantingDate; }
    public void setPlantingDate(LocalDate plantingDate) { this.plantingDate = plantingDate; }

    public LocalDate getExpectedHarvestDate() { return expectedHarvestDate; }
    public void setExpectedHarvestDate(LocalDate expectedHarvestDate) { this.expectedHarvestDate = expectedHarvestDate; }

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
