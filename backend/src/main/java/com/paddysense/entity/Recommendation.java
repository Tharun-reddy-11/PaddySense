package com.paddysense.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String currentPractice;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String recommendedAction;

    @Column(columnDefinition = "TEXT")
    private String estimatedImpact;

    @Column(columnDefinition = "TEXT")
    private String potentialTradeOffs;

    private String evidenceSource;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Recommendation() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCurrentPractice() { return currentPractice; }
    public void setCurrentPractice(String currentPractice) { this.currentPractice = currentPractice; }

    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }

    public String getEstimatedImpact() { return estimatedImpact; }
    public void setEstimatedImpact(String estimatedImpact) { this.estimatedImpact = estimatedImpact; }

    public String getPotentialTradeOffs() { return potentialTradeOffs; }
    public void setPotentialTradeOffs(String potentialTradeOffs) { this.potentialTradeOffs = potentialTradeOffs; }

    public String getEvidenceSource() { return evidenceSource; }
    public void setEvidenceSource(String evidenceSource) { this.evidenceSource = evidenceSource; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
