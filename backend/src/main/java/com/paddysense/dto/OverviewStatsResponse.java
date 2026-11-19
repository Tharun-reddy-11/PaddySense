package com.paddysense.dto;

import java.util.List;
import java.util.Map;

public class OverviewStatsResponse {
    private Long totalFields;
    private Long totalAssessments;
    private Double latestEstimatedEmission;
    private String latestRiskCategory;
    private Double averageEmission;
    
    // Risk breakdown counts
    private Long lowRiskCount;
    private Long moderateRiskCount;
    private Long highRiskCount;
    private Long veryHighRiskCount;

    // Recent assessments for table
    private List<AssessmentDetailResponse> recentAssessments;
    
    // Trend series for charts
    private List<Map<String, Object>> seasonalTrends;

    public OverviewStatsResponse() {}

    // Getters and Setters
    public Long getTotalFields() { return totalFields; }
    public void setTotalFields(Long totalFields) { this.totalFields = totalFields; }

    public Long getTotalAssessments() { return totalAssessments; }
    public void setTotalAssessments(Long totalAssessments) { this.totalAssessments = totalAssessments; }

    public Double getLatestEstimatedEmission() { return latestEstimatedEmission; }
    public void setLatestEstimatedEmission(Double latestEstimatedEmission) { this.latestEstimatedEmission = latestEstimatedEmission; }

    public String getLatestRiskCategory() { return latestRiskCategory; }
    public void setLatestRiskCategory(String latestRiskCategory) { this.latestRiskCategory = latestRiskCategory; }

    public Double getAverageEmission() { return averageEmission; }
    public void setAverageEmission(Double averageEmission) { this.averageEmission = averageEmission; }

    public Long getLowRiskCount() { return lowRiskCount; }
    public void setLowRiskCount(Long lowRiskCount) { this.lowRiskCount = lowRiskCount; }

    public Long getModerateRiskCount() { return moderateRiskCount; }
    public void setModerateRiskCount(Long moderateRiskCount) { this.moderateRiskCount = moderateRiskCount; }

    public Long getHighRiskCount() { return highRiskCount; }
    public void setHighRiskCount(Long highRiskCount) { this.highRiskCount = highRiskCount; }

    public Long getVeryHighRiskCount() { return veryHighRiskCount; }
    public void setVeryHighRiskCount(Long veryHighRiskCount) { this.veryHighRiskCount = veryHighRiskCount; }

    public List<AssessmentDetailResponse> getRecentAssessments() { return recentAssessments; }
    public void setRecentAssessments(List<AssessmentDetailResponse> recentAssessments) { this.recentAssessments = recentAssessments; }

    public List<Map<String, Object>> getSeasonalTrends() { return seasonalTrends; }
    public void setSeasonalTrends(List<Map<String, Object>> seasonalTrends) { this.seasonalTrends = seasonalTrends; }
}
