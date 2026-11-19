package com.paddysense.service;

import com.paddysense.dto.AssessmentCreateRequest;
import com.paddysense.dto.AssessmentDetailResponse;
import com.paddysense.entity.*;
import com.paddysense.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentInputRepository assessmentInputRepository;
    private final PredictionRepository predictionRepository;
    private final PredictionExplanationRepository predictionExplanationRepository;
    private final RecommendationRepository recommendationRepository;
    private final FieldRepository fieldRepository;
    private final UserRepository userRepository;
    private final MlServiceProxy mlServiceProxy;
    private final NotificationService notificationService;

    public AssessmentService(AssessmentRepository assessmentRepository,
                             AssessmentInputRepository assessmentInputRepository,
                             PredictionRepository predictionRepository,
                             PredictionExplanationRepository predictionExplanationRepository,
                             RecommendationRepository recommendationRepository,
                             FieldRepository fieldRepository,
                             UserRepository userRepository,
                             MlServiceProxy mlServiceProxy,
                             NotificationService notificationService) {
        this.assessmentRepository = assessmentRepository;
        this.assessmentInputRepository = assessmentInputRepository;
        this.predictionRepository = predictionRepository;
        this.predictionExplanationRepository = predictionExplanationRepository;
        this.recommendationRepository = recommendationRepository;
        this.fieldRepository = fieldRepository;
        this.userRepository = userRepository;
        this.mlServiceProxy = mlServiceProxy;
        this.notificationService = notificationService;
    }

    @Transactional
    public AssessmentDetailResponse createAssessment(AssessmentCreateRequest req, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Field field = null;
        if (req.getFieldId() != null) {
            field = fieldRepository.findByIdAndUserId(req.getFieldId(), user.getId())
                    .or(() -> fieldRepository.findById(req.getFieldId()))
                    .orElse(null);
        }
        if (field == null) {
            List<Field> userFields = fieldRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
            if (!userFields.isEmpty()) {
                field = userFields.get(0);
            } else {
                field = new Field();
                field.setUser(user);
                field.setFieldName("Delta Rice Plot");
                field.setAreaHectares(2.0);
                field.setState(user.getState() != null ? user.getState() : "Andhra Pradesh");
                field.setDistrict(user.getDistrict() != null ? user.getDistrict() : "Kadapa");
                field.setVillage(user.getVillage() != null ? user.getVillage() : "Yanamadala");
                field.setLatitude(14.47);
                field.setLongitude(78.82);
                field.setSoilPh(req.getSoilPh() != null ? req.getSoilPh() : 7.8);
                field.setSoilOrganicCarbonPct(req.getSoilOrganicCarbonPct() != null ? req.getSoilOrganicCarbonPct() : 0.85);
                field.setSoilTexture(req.getSoilTexture() != null ? req.getSoilTexture() : "Clay Loam");
                field.setCurrentSeason(req.getSeason() != null ? req.getSeason() : "Kharif");
                field = fieldRepository.save(field);
            }
        }

        // 1. Create Assessment Entity
        Assessment assessment = new Assessment();
        assessment.setUser(user);
        assessment.setField(field);
        assessment.setSeason(req.getSeason() != null ? req.getSeason() : field.getCurrentSeason());
        assessment.setPlantingDate(req.getPlantingDate());
        assessment.setExpectedHarvestDate(req.getExpectedHarvestDate());
        assessment.setStatus("COMPLETED");

        Assessment savedAssessment = assessmentRepository.save(assessment);

        // 2. Create Assessment Input Snapshot
        AssessmentInput input = new AssessmentInput();
        input.setAssessment(savedAssessment);
        input.setSoilPh(req.getSoilPh() != null ? req.getSoilPh() : field.getSoilPh());
        input.setSoilOrganicCarbonPct(req.getSoilOrganicCarbonPct() != null ? req.getSoilOrganicCarbonPct() : field.getSoilOrganicCarbonPct());
        input.setSoilNitrogenPct(req.getSoilNitrogenPct() != null ? req.getSoilNitrogenPct() : 0.18);
        input.setSoilTexture(req.getSoilTexture() != null ? req.getSoilTexture() : field.getSoilTexture());
        input.setBulkDensityGCm3(req.getBulkDensityGCm3() != null ? req.getBulkDensityGCm3() : 1.35);

        input.setWaterManagementMethod(req.getWaterManagementMethod() != null ? req.getWaterManagementMethod() : "Continuous Flooding");
        input.setFloodingDurationDays(req.getFloodingDurationDays() != null ? req.getFloodingDurationDays() : 80.0);
        input.setDryingDurationDays(req.getDryingDurationDays() != null ? req.getDryingDurationDays() : 10.0);
        input.setWaterDepthCm(req.getWaterDepthCm() != null ? req.getWaterDepthCm() : 5.0);
        input.setIrrigationFrequencySeason(req.getIrrigationFrequencySeason() != null ? req.getIrrigationFrequencySeason() : 14);

        input.setNitrogenFertilizerKgHa(req.getNitrogenFertilizerKgHa() != null ? req.getNitrogenFertilizerKgHa() : 120.0);
        input.setFertilizerType(req.getFertilizerType() != null ? req.getFertilizerType() : "Neem Coated Urea");
        input.setFertilizerApplicationMethod(req.getFertilizerApplicationMethod() != null ? req.getFertilizerApplicationMethod() : "Broadcasting");
        input.setFertilizerSplitCount(req.getFertilizerSplitCount() != null ? req.getFertilizerSplitCount() : 3);

        input.setStrawResidueManagement(req.getStrawResidueManagement() != null ? req.getStrawResidueManagement() : "Incorporated");
        input.setStrawResidueKgHa(req.getStrawResidueKgHa() != null ? req.getStrawResidueKgHa() : 1800.0);
        input.setRiceVarietyGroup(req.getRiceVarietyGroup() != null ? req.getRiceVarietyGroup() : field.getRiceVariety());
        input.setCropDurationDays(req.getCropDurationDays() != null ? req.getCropDurationDays() : 120);
        input.setPlantingMethod(req.getPlantingMethod() != null ? req.getPlantingMethod() : "Transplanted");

        input.setAvgTemperatureC(req.getAvgTemperatureC() != null ? req.getAvgTemperatureC() : 29.5);
        input.setTotalRainfallMm(req.getTotalRainfallMm() != null ? req.getTotalRainfallMm() : 950.0);
        input.setRelativeHumidityPct(req.getRelativeHumidityPct() != null ? req.getRelativeHumidityPct() : 72.0);

        assessmentInputRepository.save(input);

        // 3. Prepare Payload and Call ML Service
        Map<String, Object> mlPayload = new HashMap<>();
        mlPayload.put("field_name", field.getFieldName());
        mlPayload.put("latitude", field.getLatitude() != null ? field.getLatitude() : 20.0);
        mlPayload.put("longitude", field.getLongitude() != null ? field.getLongitude() : 78.0);
        mlPayload.put("soil_ph", input.getSoilPh());
        mlPayload.put("soil_organic_carbon_pct", input.getSoilOrganicCarbonPct());
        mlPayload.put("soil_nitrogen_pct", input.getSoilNitrogenPct());
        mlPayload.put("soil_texture", input.getSoilTexture());
        mlPayload.put("bulk_density_g_cm3", input.getBulkDensityGCm3());
        mlPayload.put("water_management_method", input.getWaterManagementMethod());
        mlPayload.put("flooding_duration_days", input.getFloodingDurationDays());
        mlPayload.put("drying_duration_days", input.getDryingDurationDays());
        mlPayload.put("water_depth_cm", input.getWaterDepthCm());
        mlPayload.put("irrigation_frequency_season", input.getIrrigationFrequencySeason());
        mlPayload.put("nitrogen_fertilizer_kg_ha", input.getNitrogenFertilizerKgHa());
        mlPayload.put("fertilizer_type", input.getFertilizerType());
        mlPayload.put("fertilizer_application_method", input.getFertilizerApplicationMethod());
        mlPayload.put("fertilizer_split_count", input.getFertilizerSplitCount());
        mlPayload.put("straw_residue_management", input.getStrawResidueManagement());
        mlPayload.put("straw_residue_kg_ha", input.getStrawResidueKgHa());
        mlPayload.put("rice_variety_group", input.getRiceVarietyGroup());
        mlPayload.put("crop_duration_days", input.getCropDurationDays());
        mlPayload.put("planting_method", input.getPlantingMethod());
        mlPayload.put("avg_temperature_c", input.getAvgTemperatureC());
        mlPayload.put("total_rainfall_mm", input.getTotalRainfallMm());
        mlPayload.put("relative_humidity_pct", input.getRelativeHumidityPct());

        Map<String, Object> predResult = mlServiceProxy.predictMethane(mlPayload);

        // 4. Save Prediction Entity
        Prediction prediction = new Prediction();
        prediction.setAssessment(savedAssessment);
        prediction.setEstimatedSeasonalCh4KgHa(getDouble(predResult, "estimated_seasonal_ch4_kg_ha", 195.0));
        prediction.setUnit((String) predResult.getOrDefault("unit", "kg CH4/ha/season"));
        prediction.setRiskCategory((String) predResult.getOrDefault("risk_category", "High"));
        prediction.setPmeiScore(getDouble(predResult, "pmei_score", 45.0));

        Map<?, ?> probs = (Map<?, ?>) predResult.get("risk_probabilities");
        if (probs != null) {
            prediction.setProbLow(getDouble(probs, "Low", 0.05));
            prediction.setProbModerate(getDouble(probs, "Moderate", 0.15));
            prediction.setProbHigh(getDouble(probs, "High", 0.30));
            prediction.setProbVeryHigh(getDouble(probs, "Very High", 0.50));
        }

        Map<?, ?> unc90 = (Map<?, ?>) predResult.get("uncertainty_90");
        if (unc90 != null) {
            prediction.setUnc90Lower(getDouble(unc90, "lower_bound", 0.0));
            prediction.setUnc90Upper(getDouble(unc90, "upper_bound", 350.0));
        }

        Map<?, ?> unc95 = (Map<?, ?>) predResult.get("uncertainty_95");
        if (unc95 != null) {
            prediction.setUnc95Lower(getDouble(unc95, "lower_bound", 0.0));
            prediction.setUnc95Upper(getDouble(unc95, "upper_bound", 400.0));
        }

        prediction.setModelName((String) predResult.getOrDefault("model_name", "PaddySense XGBoost Regressor"));
        prediction.setModelVersion((String) predResult.getOrDefault("model_version", "1.0.0-PROD"));
        prediction.setScientificDisclaimer((String) predResult.getOrDefault("scientific_disclaimer", ""));

        Prediction savedPrediction = predictionRepository.save(prediction);

        // 5. Save Prediction Explanations (TreeSHAP)
        List<?> factors = (List<?>) predResult.get("top_contributing_factors");
        if (factors != null) {
            for (Object item : factors) {
                if (item instanceof Map<?, ?>) {
                    Map<?, ?> factorMap = (Map<?, ?>) item;
                    PredictionExplanation explanation = new PredictionExplanation(
                            savedPrediction,
                            getString(factorMap, "feature", ""),
                            getString(factorMap, "feature_value", ""),
                            getDouble(factorMap, "contribution_kg_ha", 0.0),
                            getString(factorMap, "direction", "Influences"),
                            getString(factorMap, "agronomic_note", "")
                    );
                    predictionExplanationRepository.save(explanation);
                }
            }
        }

        // 6. Fetch and Save Practical Agronomic Recommendations
        try {
            Map<String, Object> recResult = mlServiceProxy.getRecommendations(mlPayload);
            List<?> recList = (List<?>) recResult.get("recommendations");
            if (recList != null) {
                for (Object rItem : recList) {
                    if (rItem instanceof Map<?, ?>) {
                        Map<?, ?> rMap = (Map<?, ?>) rItem;
                        Recommendation rec = new Recommendation();
                        rec.setAssessment(savedAssessment);
                        rec.setCategory(getString(rMap, "category", "General"));
                        rec.setTitle(getString(rMap, "title", "Practice Optimization"));
                        rec.setCurrentPractice(getString(rMap, "current_practice", ""));
                        rec.setRecommendedAction(getString(rMap, "recommended_action", ""));
                        rec.setEstimatedImpact(getString(rMap, "estimated_impact", ""));
                        rec.setPotentialTradeOffs(getString(rMap, "potential_trade_offs", ""));
                        rec.setEvidenceSource(getString(rMap, "evidence_source", ""));
                        recommendationRepository.save(rec);
                    }
                }
            }
        } catch (Exception e) {
            // Non-blocking recommendation error
        }

        // 7. Trigger System Notification
        notificationService.createNotification(
                user,
                "Assessment Completed: " + field.getFieldName(),
                String.format("Estimated seasonal emission: %.1f kg CH4/ha (%s Risk).",
                        prediction.getEstimatedSeasonalCh4KgHa(), prediction.getRiskCategory()),
                "SUCCESS"
        );

        return getAssessmentDetail(savedAssessment.getId(), userEmail);
    }

    public List<AssessmentDetailResponse> getFarmerAssessmentHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Assessment> assessments = assessmentRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<AssessmentDetailResponse> list = new ArrayList<>();

        for (Assessment a : assessments) {
            list.add(mapToDetail(a));
        }
        return list;
    }

    public AssessmentDetailResponse getAssessmentDetail(Long assessmentId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Assessment assessment = assessmentRepository.findByIdAndUserId(assessmentId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found or access denied"));

        return mapToDetail(assessment);
    }

    private AssessmentDetailResponse mapToDetail(Assessment a) {
        AssessmentDetailResponse res = new AssessmentDetailResponse();
        res.setId(a.getId());
        res.setFieldId(a.getField().getId());
        res.setFieldName(a.getField().getFieldName());
        res.setLocation(String.format("%s, %s",
                a.getField().getDistrict() != null ? a.getField().getDistrict() : "",
                a.getField().getState() != null ? a.getField().getState() : "").trim());
        res.setSeason(a.getSeason());
        res.setPlantingDate(a.getPlantingDate());
        res.setExpectedHarvestDate(a.getExpectedHarvestDate());
        res.setStatus(a.getStatus());
        res.setFieldImage(a.getField() != null ? a.getField().getFieldImage() : null);
        res.setCreatedAt(a.getCreatedAt());

        predictionRepository.findByAssessmentId(a.getId()).ifPresent(p -> {
            res.setEstimatedSeasonalCh4KgHa(p.getEstimatedSeasonalCh4KgHa());
            res.setUnit(p.getUnit());
            res.setRiskCategory(p.getRiskCategory());
            res.setPmeiScore(p.getPmeiScore());

            Map<String, Double> probs = new HashMap<>();
            probs.put("Low", p.getProbLow());
            probs.put("Moderate", p.getProbModerate());
            probs.put("High", p.getProbHigh());
            probs.put("Very High", p.getProbVeryHigh());
            res.setRiskProbabilities(probs);

            Map<String, Double> u90 = new HashMap<>();
            u90.put("lower_bound", p.getUnc90Lower());
            u90.put("upper_bound", p.getUnc90Upper());
            res.setUncertainty90(u90);

            Map<String, Double> u95 = new HashMap<>();
            u95.put("lower_bound", p.getUnc95Lower());
            u95.put("upper_bound", p.getUnc95Upper());
            res.setUncertainty95(u95);

            res.setModelName(p.getModelName());
            res.setModelVersion(p.getModelVersion());
            res.setScientificDisclaimer(p.getScientificDisclaimer());

            List<PredictionExplanation> explanations = predictionExplanationRepository.findByPredictionId(p.getId());
            List<Map<String, Object>> factors = new ArrayList<>();
            for (PredictionExplanation exp : explanations) {
                Map<String, Object> fm = new HashMap<>();
                fm.put("feature", exp.getFeatureName());
                fm.put("feature_value", exp.getFeatureValue());
                fm.put("contribution_kg_ha", exp.getContributionKgHa());
                fm.put("direction", exp.getDirection());
                fm.put("agronomic_note", exp.getAgronomicNote());
                factors.add(fm);
            }
            res.setContributingFactors(factors);
        });

        List<Recommendation> recs = recommendationRepository.findByAssessmentId(a.getId());
        List<Map<String, Object>> recMaps = new ArrayList<>();
        for (Recommendation r : recs) {
            Map<String, Object> rm = new HashMap<>();
            rm.put("category", r.getCategory());
            rm.put("title", r.getTitle());
            rm.put("current_practice", r.getCurrentPractice());
            rm.put("recommended_action", r.getRecommendedAction());
            rm.put("estimated_impact", r.getEstimatedImpact());
            rm.put("potential_trade_offs", r.getPotentialTradeOffs());
            rm.put("evidence_source", r.getEvidenceSource());
            recMaps.add(rm);
        }
        res.setRecommendations(recMaps);

        assessmentInputRepository.findByAssessmentId(a.getId()).ifPresent(inp -> {
            Map<String, Object> snap = new HashMap<>();
            snap.put("soil_ph", inp.getSoilPh());
            snap.put("soil_organic_carbon_pct", inp.getSoilOrganicCarbonPct());
            snap.put("soil_nitrogen_pct", inp.getSoilNitrogenPct());
            snap.put("soil_texture", inp.getSoilTexture());
            snap.put("bulk_density_g_cm3", inp.getBulkDensityGCm3());
            snap.put("water_management_method", inp.getWaterManagementMethod());
            snap.put("flooding_duration_days", inp.getFloodingDurationDays());
            snap.put("drying_duration_days", inp.getDryingDurationDays());
            snap.put("water_depth_cm", inp.getWaterDepthCm());
            snap.put("irrigation_frequency_season", inp.getIrrigationFrequencySeason());
            snap.put("nitrogen_fertilizer_kg_ha", inp.getNitrogenFertilizerKgHa());
            snap.put("fertilizer_type", inp.getFertilizerType());
            snap.put("fertilizer_application_method", inp.getFertilizerApplicationMethod());
            snap.put("fertilizer_split_count", inp.getFertilizerSplitCount());
            snap.put("straw_residue_management", inp.getStrawResidueManagement());
            snap.put("straw_residue_kg_ha", inp.getStrawResidueKgHa());
            snap.put("rice_variety_group", inp.getRiceVarietyGroup());
            snap.put("crop_duration_days", inp.getCropDurationDays());
            snap.put("planting_method", inp.getPlantingMethod());
            snap.put("avg_temperature_c", inp.getAvgTemperatureC());
            snap.put("total_rainfall_mm", inp.getTotalRainfallMm());
            snap.put("relative_humidity_pct", inp.getRelativeHumidityPct());
            res.setInputSnapshot(snap);
        });

        return res;
    }

    private Double getDouble(Map<?, ?> map, String key, Double defaultVal) {
        if (map == null || !map.containsKey(key)) return defaultVal;
        Object v = map.get(key);
        if (v instanceof Number) return ((Number) v).doubleValue();
        try {
            return Double.parseDouble(String.valueOf(v));
        } catch (Exception e) {
            return defaultVal;
        }
    }

    private String getString(Map<?, ?> map, String key, String defaultVal) {
        if (map == null || !map.containsKey(key)) return defaultVal;
        Object v = map.get(key);
        return v != null ? String.valueOf(v) : defaultVal;
    }
}
