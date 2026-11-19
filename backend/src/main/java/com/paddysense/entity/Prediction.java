package com.paddysense.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false, unique = true)
    private Assessment assessment;

    @Column(nullable = false)
    private Double estimatedSeasonalCh4KgHa;

    @Column(length = 50)
    private String unit = "kg CH4/ha/season";

    @Column(nullable = false, length = 50)
    private String riskCategory;

    private Double pmeiScore;

    // Calibrated Probabilities
    private Double probLow = 0.0;
    private Double probModerate = 0.0;
    private Double probHigh = 0.0;
    private Double probVeryHigh = 0.0;

    // Conformal Uncertainty Intervals
    private Double unc90Lower;
    private Double unc90Upper;
    private Double unc95Lower;
    private Double unc95Upper;

    private String modelName;
    private String modelVersion;

    @Column(columnDefinition = "TEXT")
    private String scientificDisclaimer;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "prediction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PredictionExplanation> explanations = new ArrayList<>();

    public Prediction() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }

    public Double getEstimatedSeasonalCh4KgHa() { return estimatedSeasonalCh4KgHa; }
    public void setEstimatedSeasonalCh4KgHa(Double estimatedSeasonalCh4KgHa) { this.estimatedSeasonalCh4KgHa = estimatedSeasonalCh4KgHa; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getRiskCategory() { return riskCategory; }
    public void setRiskCategory(String riskCategory) { this.riskCategory = riskCategory; }

    public Double getPmeiScore() { return pmeiScore; }
    public void setPmeiScore(Double pmeiScore) { this.pmeiScore = pmeiScore; }

    public Double getProbLow() { return probLow; }
    public void setProbLow(Double probLow) { this.probLow = probLow; }

    public Double getProbModerate() { return probModerate; }
    public void setProbModerate(Double probModerate) { this.probModerate = probModerate; }

    public Double getProbHigh() { return probHigh; }
    public void setProbHigh(Double probHigh) { this.probHigh = probHigh; }

    public Double getProbVeryHigh() { return probVeryHigh; }
    public void setProbVeryHigh(Double probVeryHigh) { this.probVeryHigh = probVeryHigh; }

    public Double getUnc90Lower() { return unc90Lower; }
    public void setUnc90Lower(Double unc90Lower) { this.unc90Lower = unc90Lower; }

    public Double getUnc90Upper() { return unc90Upper; }
    public void setUnc90Upper(Double unc90Upper) { this.unc90Upper = unc90Upper; }

    public Double getUnc95Lower() { return unc95Lower; }
    public void setUnc95Lower(Double unc95Lower) { this.unc95Lower = unc95Lower; }

    public Double getUnc95Upper() { return unc95Upper; }
    public void setUnc95Upper(Double unc95Upper) { this.unc95Upper = unc95Upper; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public String getScientificDisclaimer() { return scientificDisclaimer; }
    public void setScientificDisclaimer(String scientificDisclaimer) { this.scientificDisclaimer = scientificDisclaimer; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<PredictionExplanation> getExplanations() { return explanations; }
    public void setExplanations(List<PredictionExplanation> explanations) { this.explanations = explanations; }
}
