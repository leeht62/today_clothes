package com.server.today_clothes.controller;

import com.server.today_clothes.dto.WeatherDto;
import com.server.today_clothes.service.WeatherAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class WeatherController {
  private final WeatherAiService weatherAiService;

  @GetMapping("/weather-image")
  public ResponseEntity<WeatherDto> getWeatherImage() {
    WeatherDto response = weatherAiService.requestWeatherImage();
    if (response == null) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    return ResponseEntity.ok(response);
  }

}
