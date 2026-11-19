package com.paddysense.controller;

import com.paddysense.dto.AssessmentCreateRequest;
import com.paddysense.dto.AssessmentDetailResponse;
import com.paddysense.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping
    public ResponseEntity<AssessmentDetailResponse> createAssessment(@RequestBody AssessmentCreateRequest req,
                                                                     @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(assessmentService.createAssessment(req, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<AssessmentDetailResponse>> getAssessmentHistory(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(assessmentService.getFarmerAssessmentHistory(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssessmentDetailResponse> getAssessmentDetail(@PathVariable Long id,
                                                                        @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(assessmentService.getAssessmentDetail(id, userDetails.getUsername()));
    }
}
