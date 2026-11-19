package com.paddysense.service;

import com.paddysense.dto.AssessmentDetailResponse;
import com.paddysense.dto.OverviewStatsResponse;
import com.paddysense.entity.Assessment;
import com.paddysense.entity.Prediction;
import com.paddysense.entity.User;
import com.paddysense.repository.AssessmentRepository;
import com.paddysense.repository.FieldRepository;
import com.paddysense.repository.PredictionRepository;
import com.paddysense.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AnalyticsService {

    private final AssessmentRepository assessmentRepository;
    private final FieldRepository fieldRepository;
    private final PredictionRepository predictionRepository;
    private final UserRepository userRepository;
    private final AssessmentService assessmentService;

    public AnalyticsService(AssessmentRepository assessmentRepository,
                            FieldRepository fieldRepository,
                            PredictionRepository predictionRepository,
                            UserRepository userRepository,
                            AssessmentService assessmentService) {
        this.assessmentRepository = assessmentRepository;
        this.fieldRepository = fieldRepository;
        this.predictionRepository = predictionRepository;
        this.userRepository = userRepository;
        this.assessmentService = assessmentService;
    }

    public OverviewStatsResponse getFarmerOverviewStats(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        OverviewStatsResponse stats = new OverviewStatsResponse();
        long totalFields = fieldRepository.countByUserId(user.getId());
        stats.setTotalFields(totalFields);

        List<Assessment> assessments = assessmentRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        stats.setTotalAssessments((long) assessments.size());

        long low = 0, mod = 0, high = 0, vhigh = 0;
        double sumEmission = 0.0;
        int predCount = 0;

        List<Map<String, Object>> trends = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM");

        for (int i = assessments.size() - 1; i >= 0; i--) {
            Assessment a = assessments.get(i);
            Optional<Prediction> pOpt = predictionRepository.findByAssessmentId(a.getId());
            if (pOpt.isPresent()) {
                Prediction p = pOpt.get();
                double emission = p.getEstimatedSeasonalCh4KgHa();
                sumEmission += emission;
                predCount++;

                String risk = p.getRiskCategory();
                if ("Low".equalsIgnoreCase(risk)) low++;
                else if ("Moderate".equalsIgnoreCase(risk)) mod++;
                else if ("High".equalsIgnoreCase(risk)) high++;
                else vhigh++;

                Map<String, Object> trendItem = new HashMap<>();
                trendItem.put("date", a.getCreatedAt().format(fmt));
                trendItem.put("field", a.getField().getFieldName());
                trendItem.put("emission", emission);
                trendItem.put("risk", risk);
                trends.add(trendItem);
            }
        }

        stats.setLowRiskCount(low);
        stats.setModerateRiskCount(mod);
        stats.setHighRiskCount(high);
        stats.setVeryHighRiskCount(vhigh);

        if (predCount > 0) {
            stats.setAverageEmission(Math.round((sumEmission / predCount) * 10.0) / 10.0);
        } else {
            stats.setAverageEmission(0.0);
        }

        if (!assessments.isEmpty()) {
            predictionRepository.findByAssessmentId(assessments.get(0).getId()).ifPresent(p -> {
                stats.setLatestEstimatedEmission(p.getEstimatedSeasonalCh4KgHa());
                stats.setLatestRiskCategory(p.getRiskCategory());
            });
        }

        // Recent assessments limit to 5
        List<AssessmentDetailResponse> recent = new ArrayList<>();
        for (int i = 0; i < Math.min(5, assessments.size()); i++) {
            recent.add(assessmentService.getAssessmentDetail(assessments.get(i).getId(), userEmail));
        }
        stats.setRecentAssessments(recent);
        stats.setSeasonalTrends(trends);

        return stats;
    }
}
