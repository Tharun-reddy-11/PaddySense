package com.paddysense.service;

import com.paddysense.dto.FieldDto;
import com.paddysense.entity.Assessment;
import com.paddysense.entity.Field;
import com.paddysense.entity.Prediction;
import com.paddysense.entity.User;
import com.paddysense.repository.AssessmentRepository;
import com.paddysense.repository.FieldRepository;
import com.paddysense.repository.PredictionRepository;
import com.paddysense.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class FieldService {

    private final FieldRepository fieldRepository;
    private final UserRepository userRepository;
    private final AssessmentRepository assessmentRepository;
    private final PredictionRepository predictionRepository;

    public FieldService(FieldRepository fieldRepository,
                        UserRepository userRepository,
                        AssessmentRepository assessmentRepository,
                        PredictionRepository predictionRepository) {
        this.fieldRepository = fieldRepository;
        this.userRepository = userRepository;
        this.assessmentRepository = assessmentRepository;
        this.predictionRepository = predictionRepository;
    }

    public List<FieldDto> getFarmerFields(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Field> fields = fieldRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<FieldDto> dtos = new ArrayList<>();

        for (Field f : fields) {
            FieldDto dto = mapToDto(f);
            List<Assessment> assessments = assessmentRepository.findByFieldIdOrderByCreatedAtDesc(f.getId());
            dto.setTotalAssessments((long) assessments.size());

            if (!assessments.isEmpty()) {
                Assessment latest = assessments.get(0);
                dto.setLastAssessmentDate(latest.getCreatedAt());
                predictionRepository.findByAssessmentId(latest.getId()).ifPresent(p -> {
                    dto.setLatestEstimatedEmission(p.getEstimatedSeasonalCh4KgHa());
                    dto.setLatestRiskCategory(p.getRiskCategory());
                });
            }
            dtos.add(dto);
        }
        return dtos;
    }

    public FieldDto getFieldById(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Field field = fieldRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Field not found or access denied"));

        return mapToDto(field);
    }

    @Transactional
    public FieldDto createField(FieldDto dto, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Field field = new Field();
        field.setUser(user);
        field.setFieldName(dto.getFieldName());
        field.setAreaHectares(dto.getAreaHectares() != null ? dto.getAreaHectares() : 1.0);
        field.setState(dto.getState());
        field.setDistrict(dto.getDistrict());
        field.setVillage(dto.getVillage());
        field.setLatitude(dto.getLatitude());
        field.setLongitude(dto.getLongitude());
        field.setSoilTexture(dto.getSoilTexture() != null ? dto.getSoilTexture() : "Clay Loam");
        field.setSoilPh(dto.getSoilPh() != null ? dto.getSoilPh() : 7.8);
        field.setSoilOrganicCarbonPct(dto.getSoilOrganicCarbonPct() != null ? dto.getSoilOrganicCarbonPct() : 0.85);
        field.setRiceVariety(dto.getRiceVariety() != null ? dto.getRiceVariety() : "Semi-dwarf High Yielding");
        field.setCurrentSeason(dto.getCurrentSeason() != null ? dto.getCurrentSeason() : "Kharif");
        field.setFieldImage(dto.getFieldImage());

        Field saved = fieldRepository.save(field);
        return mapToDto(saved);
    }

    @Transactional
    public FieldDto updateField(Long id, FieldDto dto, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Field field = fieldRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Field not found or access denied"));

        if (dto.getFieldName() != null) field.setFieldName(dto.getFieldName());
        if (dto.getAreaHectares() != null) field.setAreaHectares(dto.getAreaHectares());
        if (dto.getState() != null) field.setState(dto.getState());
        if (dto.getDistrict() != null) field.setDistrict(dto.getDistrict());
        if (dto.getVillage() != null) field.setVillage(dto.getVillage());
        if (dto.getLatitude() != null) field.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) field.setLongitude(dto.getLongitude());
        if (dto.getSoilTexture() != null) field.setSoilTexture(dto.getSoilTexture());
        if (dto.getSoilPh() != null) field.setSoilPh(dto.getSoilPh());
        if (dto.getSoilOrganicCarbonPct() != null) field.setSoilOrganicCarbonPct(dto.getSoilOrganicCarbonPct());
        if (dto.getRiceVariety() != null) field.setRiceVariety(dto.getRiceVariety());
        if (dto.getCurrentSeason() != null) field.setCurrentSeason(dto.getCurrentSeason());
        if (dto.getFieldImage() != null) field.setFieldImage(dto.getFieldImage());

        Field updated = fieldRepository.save(field);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteField(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Field field = fieldRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Field not found or access denied"));

        fieldRepository.delete(field);
    }

    private FieldDto mapToDto(Field f) {
        FieldDto dto = new FieldDto();
        dto.setId(f.getId());
        dto.setFieldName(f.getFieldName());
        dto.setAreaHectares(f.getAreaHectares());
        dto.setState(f.getState());
        dto.setDistrict(f.getDistrict());
        dto.setVillage(f.getVillage());
        dto.setLatitude(f.getLatitude());
        dto.setLongitude(f.getLongitude());
        dto.setSoilTexture(f.getSoilTexture());
        dto.setSoilPh(f.getSoilPh());
        dto.setSoilOrganicCarbonPct(f.getSoilOrganicCarbonPct());
        dto.setRiceVariety(f.getRiceVariety());
        dto.setCurrentSeason(f.getCurrentSeason());
        dto.setFieldImage(f.getFieldImage());
        dto.setCreatedAt(f.getCreatedAt());
        return dto;
    }
}
