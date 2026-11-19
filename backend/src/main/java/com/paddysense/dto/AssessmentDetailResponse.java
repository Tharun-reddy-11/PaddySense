package com.paddysense.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class AssessmentDetailResponse {
    private Long id;
    private Long fieldId;
    private String fieldName;
    private String location;
    private String season;
    private String fieldImage;
    private LocalDate plantingDate;
    private LocalDate expectedHarvestDate;
    private String status;
    private LocalDateTime createdAt;

    // Numerical Prediction Details
    private Double estimatedSeasonalCh4KgHa;
    private String unit;
    private String riskCategory;
    private Double pmeiScore;
    private Map<String, Double> riskProbabilities;
    private Map<String, Double> uncertainty90;
    private Map<String, Double> uncertainty95;
    private String modelName;
    private String modelVersion;
    private String scientificDisclaimer;

    // SHAP Explainability & Recommendations
    private List<Map<String, Object>> contributingFactors;
    private List<Map<String, Object>> recommendations;

    // Original Input Snapshot
    private Map<String, Object> inputSnapshot;

    public AssessmentDetailResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFieldId() { return fieldId; }
    public void setFieldId(Long fieldId) { this.fieldId = fieldId; }

    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    public String getFieldImage() { return fieldImage; }
    public void setFieldImage(String fieldImage) { this.fieldImage = fieldImage; }

    public LocalDate getPlantingDate() { return plantingDate; }
    public void setPlantingDate(LocalDate plantingDate) { this.plantingDate = plantingDate; }

    public LocalDate getExpectedHarvestDate() { return expectedHarvestDate; }
    public void setExpectedHarvestDate(LocalDate expectedHarvestDate) { this.expectedHarvestDate = expectedHarvestDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Double getEstimatedSeasonalCh4KgHa() { return estimatedSeasonalCh4KgHa; }
    public void setEstimatedSeasonalCh4KgHa(Double estimatedSeasonalCh4KgHa) { this.estimatedSeasonalCh4KgHa = estimatedSeasonalCh4KgHa; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getRiskCategory() { return riskCategory; }
    public void setRiskCategory(String riskCategory) { this.riskCategory = riskCategory; }

    public Double getPmeiScore() { return pmeiScore; }
    public void setPmeiScore(Double pmeiScore) { this.pmeiScore = pmeiScore; }

    public Map<String, Double> getRiskProbabilities() { return riskProbabilities; }
    public void setRiskProbabilities(Map<String, Double> riskProbabilities) { this.riskProbabilities = riskProbabilities; }

    public Map<String, Double> getUncertainty90() { return uncertainty90; }
    public void setUncertainty90(Map<String, Double> uncertainty90) { this.uncertainty90 = uncertainty90; }

    public Map<String, Double> getUncertainty95() { return uncertainty95; }
    public void setUncertainty95(Map<String, Double> uncertainty95) { this.uncertainty95 = uncertainty95; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public String getScientificDisclaimer() { return scientificDisclaimer; }
    public void setScientificDisclaimer(String scientificDisclaimer) { this.scientificDisclaimer = scientificDisclaimer; }

    public List<Map<String, Object>> getContributingFactors() { return contributingFactors; }
    public void setContributingFactors(List<Map<String, Object>> contributingFactors) { this.contributingFactors = contributingFactors; }

    public List<Map<String, Object>> getRecommendations() { return recommendations; }
    public void setRecommendations(List<Map<String, Object>> recommendations) { this.recommendations = recommendations; }

    public Map<String, Object> getInputSnapshot() { return inputSnapshot; }
    public void setInputSnapshot(Map<String, Object> inputSnapshot) { this.inputSnapshot = inputSnapshot; }
}
