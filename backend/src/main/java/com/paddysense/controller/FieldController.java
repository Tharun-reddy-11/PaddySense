package com.paddysense.controller;

import com.paddysense.dto.FieldDto;
import com.paddysense.service.FieldService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fields")
public class FieldController {

    private final FieldService fieldService;

    public FieldController(FieldService fieldService) {
        this.fieldService = fieldService;
    }

    @GetMapping
    public ResponseEntity<List<FieldDto>> getFields(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(fieldService.getFarmerFields(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FieldDto> getFieldById(@PathVariable Long id,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(fieldService.getFieldById(id, userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<FieldDto> createField(@RequestBody FieldDto dto,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(fieldService.createField(dto, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FieldDto> updateField(@PathVariable Long id,
                                                @RequestBody FieldDto dto,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(fieldService.updateField(id, dto, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteField(@PathVariable Long id,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        fieldService.deleteField(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
