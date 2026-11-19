package com.paddysense.repository;

import com.paddysense.entity.AssessmentInput;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AssessmentInputRepository extends JpaRepository<AssessmentInput, Long> {
    Optional<AssessmentInput> findByAssessmentId(Long assessmentId);
}
