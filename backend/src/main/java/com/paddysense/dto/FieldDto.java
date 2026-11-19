package com.paddysense.dto;

import java.time.LocalDateTime;

public class FieldDto {
    private Long id;
    private String fieldName;
    private Double areaHectares;
    private String state;
    private String district;
    private String village;
    private Double latitude;
    private Double longitude;
    private String soilTexture;
    private Double soilPh;
    private Double soilOrganicCarbonPct;
    private String riceVariety;
    private String currentSeason;
    private String fieldImage;
    private LocalDateTime createdAt;
    
    // Aggregated assessment stats for field cards
    private Long totalAssessments;
    private Double latestEstimatedEmission;
    private String latestRiskCategory;
    private LocalDateTime lastAssessmentDate;

    public FieldDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }

    public Double getAreaHectares() { return areaHectares; }
    public void setAreaHectares(Double areaHectares) { this.areaHectares = areaHectares; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getSoilTexture() { return soilTexture; }
    public void setSoilTexture(String soilTexture) { this.soilTexture = soilTexture; }

    public Double getSoilPh() { return soilPh; }
    public void setSoilPh(Double soilPh) { this.soilPh = soilPh; }

    public Double getSoilOrganicCarbonPct() { return soilOrganicCarbonPct; }
    public void setSoilOrganicCarbonPct(Double soilOrganicCarbonPct) { this.soilOrganicCarbonPct = soilOrganicCarbonPct; }

    public String getRiceVariety() { return riceVariety; }
    public void setRiceVariety(String riceVariety) { this.riceVariety = riceVariety; }

    public String getCurrentSeason() { return currentSeason; }
    public void setCurrentSeason(String currentSeason) { this.currentSeason = currentSeason; }

    public String getFieldImage() { return fieldImage; }
    public void setFieldImage(String fieldImage) { this.fieldImage = fieldImage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getTotalAssessments() { return totalAssessments; }
    public void setTotalAssessments(Long totalAssessments) { this.totalAssessments = totalAssessments; }

    public Double getLatestEstimatedEmission() { return latestEstimatedEmission; }
    public void setLatestEstimatedEmission(Double latestEstimatedEmission) { this.latestEstimatedEmission = latestEstimatedEmission; }

    public String getLatestRiskCategory() { return latestRiskCategory; }
    public void setLatestRiskCategory(String latestRiskCategory) { this.latestRiskCategory = latestRiskCategory; }

    public LocalDateTime getLastAssessmentDate() { return lastAssessmentDate; }
    public void setLastAssessmentDate(LocalDateTime lastAssessmentDate) { this.lastAssessmentDate = lastAssessmentDate; }
}
