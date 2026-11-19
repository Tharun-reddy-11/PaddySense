package com.paddysense.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fields")
public class Field {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String fieldName;

    @Column(nullable = false)
    private Double areaHectares;

    private String state;
    private String district;
    private String village;

    private Double latitude;
    private Double longitude;

    private String soilTexture = "Clay Loam";
    private Double soilPh = 7.8;
    private Double soilOrganicCarbonPct = 0.85;

    private String riceVariety = "Semi-dwarf High Yielding";
    private String currentSeason = "Kharif";

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String fieldImage;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Field() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
