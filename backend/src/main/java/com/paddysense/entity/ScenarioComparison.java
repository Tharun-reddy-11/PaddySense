package com.paddysense.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "scenario_comparisons")
public class ScenarioComparison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @Column(nullable = false, length = 150)
    private String scenarioTitle;

    @Column(nullable = false)
    private Double baselineEmissionKgHa;

    @Column(nullable = false)
    private Double alternativeEmissionKgHa;

    @Column(nullable = false)
    private Double differenceKgHa;

    @Column(nullable = false)
    private Double percentageChange;

    @Column(nullable = false, length = 50)
    private String mitigationDirection;

    @Column(columnDefinition = "TEXT")
    private String tradeOffWarning;

    @Column(columnDefinition = "TEXT")
    private String notesJson;

    private LocalDateTime createdAt = LocalDateTime.now();

    public ScenarioComparison() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }

    public String getScenarioTitle() { return scenarioTitle; }
    public void setScenarioTitle(String scenarioTitle) { this.scenarioTitle = scenarioTitle; }

    public Double getBaselineEmissionKgHa() { return baselineEmissionKgHa; }
    public void setBaselineEmissionKgHa(Double baselineEmissionKgHa) { this.baselineEmissionKgHa = baselineEmissionKgHa; }

    public Double getAlternativeEmissionKgHa() { return alternativeEmissionKgHa; }
    public void setAlternativeEmissionKgHa(Double alternativeEmissionKgHa) { this.alternativeEmissionKgHa = alternativeEmissionKgHa; }

    public Double getDifferenceKgHa() { return differenceKgHa; }
    public void setDifferenceKgHa(Double differenceKgHa) { this.differenceKgHa = differenceKgHa; }

    public Double getPercentageChange() { return percentageChange; }
    public void setPercentageChange(Double percentageChange) { this.percentageChange = percentageChange; }

    public String getMitigationDirection() { return mitigationDirection; }
    public void setMitigationDirection(String mitigationDirection) { this.mitigationDirection = mitigationDirection; }

    public String getTradeOffWarning() { return tradeOffWarning; }
    public void setTradeOffWarning(String tradeOffWarning) { this.tradeOffWarning = tradeOffWarning; }

    public String getNotesJson() { return notesJson; }
    public void setNotesJson(String notesJson) { this.notesJson = notesJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
