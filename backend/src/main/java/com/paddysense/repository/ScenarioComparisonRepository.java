package com.paddysense.repository;

import com.paddysense.entity.ScenarioComparison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScenarioComparisonRepository extends JpaRepository<ScenarioComparison, Long> {
    List<ScenarioComparison> findByAssessmentId(Long assessmentId);
}
