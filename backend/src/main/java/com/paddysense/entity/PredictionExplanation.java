package com.paddysense.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "prediction_explanations")
public class PredictionExplanation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prediction_id", nullable = false)
    private Prediction prediction;

    @Column(nullable = false, length = 100)
    private String featureName;

    private String featureValue;

    @Column(nullable = false)
    private Double contributionKgHa;

    @Column(nullable = false, length = 50)
    private String direction;

    @Column(columnDefinition = "TEXT")
    private String agronomicNote;

    public PredictionExplanation() {}

    public PredictionExplanation(Prediction prediction, String featureName, String featureValue, 
                                 Double contributionKgHa, String direction, String agronomicNote) {
        this.prediction = prediction;
        this.featureName = featureName;
        this.featureValue = featureValue;
        this.contributionKgHa = contributionKgHa;
        this.direction = direction;
        this.agronomicNote = agronomicNote;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Prediction getPrediction() { return prediction; }
    public void setPrediction(Prediction prediction) { this.prediction = prediction; }

    public String getFeatureName() { return featureName; }
    public void setFeatureName(String featureName) { this.featureName = featureName; }

    public String getFeatureValue() { return featureValue; }
    public void setFeatureValue(String featureValue) { this.featureValue = featureValue; }

    public Double getContributionKgHa() { return contributionKgHa; }
    public void setContributionKgHa(Double contributionKgHa) { this.contributionKgHa = contributionKgHa; }

    public String getDirection() { return direction; }
    public void setDirection(String direction) { this.direction = direction; }

    public String getAgronomicNote() { return agronomicNote; }
    public void setAgronomicNote(String agronomicNote) { this.agronomicNote = agronomicNote; }
}
