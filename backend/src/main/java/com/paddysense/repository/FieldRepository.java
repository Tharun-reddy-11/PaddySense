package com.paddysense.repository;

import com.paddysense.entity.Field;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FieldRepository extends JpaRepository<Field, Long> {
    List<Field> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Field> findByIdAndUserId(Long id, Long userId);
    long countByUserId(Long userId);
}
