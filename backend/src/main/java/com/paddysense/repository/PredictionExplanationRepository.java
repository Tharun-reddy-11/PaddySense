package com.paddysense.repository;

import com.paddysense.entity.PredictionExplanation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PredictionExplanationRepository extends JpaRepository<PredictionExplanation, Long> {
    List<PredictionExplanation> findByPredictionId(Long predictionId);
}
