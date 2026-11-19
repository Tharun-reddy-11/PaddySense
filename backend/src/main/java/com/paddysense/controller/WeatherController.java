package com.paddysense.controller;

import com.paddysense.service.NasaPowerWeatherService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final NasaPowerWeatherService weatherService;

    public WeatherController(NasaPowerWeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/daily")
    public ResponseEntity<Map<String, Object>> getDailyWeather(
            @RequestParam(required = false, defaultValue = "28.64") Double latitude,
            @RequestParam(required = false, defaultValue = "77.16") Double longitude,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(weatherService.getDailyAgroclimatology(latitude, longitude, startDate, endDate));
    }
}
