package com.server.today_clothes.controller;

import com.server.today_clothes.dto.WeatherDto;
import com.server.today_clothes.service.WeatherAiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

public class WeatherController {
  private final WeatherAiService weatherAiService;

  public WeatherController(WeatherAiService weatherAiService) {
    this.weatherAiService = weatherAiService;
  }

  @GetMapping("/weather-image")
  public ResponseEntity<WeatherDto> getWeatherImage() {
    WeatherDto response = weatherAiService.requestWeatherImage();
    if (response == null) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    return ResponseEntity.ok(response);
  }

}
