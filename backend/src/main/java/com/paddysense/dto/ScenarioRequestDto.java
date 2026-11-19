package com.paddysense.dto;

import java.util.Map;

public class ScenarioRequestDto {
    private Long assessmentId;
    private String scenarioTitle;
    private Map<String, Object> currentPractice;
    private Map<String, Object> alternativeScenario;

    public ScenarioRequestDto() {}

    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }

    public String getScenarioTitle() { return scenarioTitle; }
    public void setScenarioTitle(String scenarioTitle) { this.scenarioTitle = scenarioTitle; }

    public Map<String, Object> getCurrentPractice() { return currentPractice; }
    public void setCurrentPractice(Map<String, Object> currentPractice) { this.currentPractice = currentPractice; }

    public Map<String, Object> getAlternativeScenario() { return alternativeScenario; }
    public void setAlternativeScenario(Map<String, Object> alternativeScenario) { this.alternativeScenario = alternativeScenario; }
}
