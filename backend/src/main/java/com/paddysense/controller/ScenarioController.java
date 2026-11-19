package com.paddysense.controller;

import com.paddysense.dto.ScenarioRequestDto;
import com.paddysense.entity.Assessment;
import com.paddysense.entity.ScenarioComparison;
import com.paddysense.entity.User;
import com.paddysense.repository.AssessmentRepository;
import com.paddysense.repository.ScenarioComparisonRepository;
import com.paddysense.repository.UserRepository;
import com.paddysense.service.MlServiceProxy;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scenarios")
public class ScenarioController {

    private final MlServiceProxy mlServiceProxy;
    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;
    private final ScenarioComparisonRepository scenarioComparisonRepository;

    public ScenarioController(MlServiceProxy mlServiceProxy,
                              AssessmentRepository assessmentRepository,
                              UserRepository userRepository,
                              ScenarioComparisonRepository scenarioComparisonRepository) {
        this.mlServiceProxy = mlServiceProxy;
        this.assessmentRepository = assessmentRepository;
        this.userRepository = userRepository;
        this.scenarioComparisonRepository = scenarioComparisonRepository;
    }

    @PostMapping("/compare")
    public ResponseEntity<Map<String, Object>> compareScenarios(@RequestBody ScenarioRequestDto req,
                                                                @AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> result = mlServiceProxy.compareScenarios(req.getCurrentPractice(), req.getAlternativeScenario());

        if (req.getAssessmentId() != null && userDetails != null) {
            User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
            if (user != null) {
                Assessment assessment = assessmentRepository.findByIdAndUserId(req.getAssessmentId(), user.getId()).orElse(null);
                if (assessment != null) {
                    ScenarioComparison sc = new ScenarioComparison();
                    sc.setAssessment(assessment);
                    sc.setScenarioTitle(req.getScenarioTitle() != null ? req.getScenarioTitle() : "Alternative Practice Simulation");
                    sc.setBaselineEmissionKgHa(getDouble(result, "current_emission_kg_ha", 195.0));
                    sc.setAlternativeEmissionKgHa(getDouble(result, "alternative_emission_kg_ha", 150.0));
                    sc.setDifferenceKgHa(getDouble(result, "difference_kg_ha", getDouble(result, "emission_difference_kg_ha", -45.0)));
                    sc.setPercentageChange(getDouble(result, "percentage_change", -23.0));
                    sc.setMitigationDirection((String) result.getOrDefault("mitigation_direction", "Reduction"));
                    sc.setTradeOffWarning((String) result.getOrDefault("trade_off_warning", ""));
                    sc.setNotesJson(String.valueOf(result.getOrDefault("agronomic_feasibility_notes", "[]")));
                    scenarioComparisonRepository.save(sc);
                }
            }
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/assessment/{assessmentId}")
    public ResponseEntity<List<ScenarioComparison>> getScenariosByAssessment(@PathVariable Long assessmentId) {
        return ResponseEntity.ok(scenarioComparisonRepository.findByAssessmentId(assessmentId));
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
}
