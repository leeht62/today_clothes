package com.server.today_clothes.controller;

import com.server.today_clothes.VO.Weather;
import com.server.today_clothes.dto.WeatherDto;
import com.server.today_clothes.service.WeatherAiService;
import com.server.today_clothes.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;


@RestController
@RequiredArgsConstructor
public class WeatherController {
  private final WeatherAiService weatherAiService;
  private final WeatherService weatherService;

  @GetMapping("/weather-image")
  public ResponseEntity<WeatherDto> getWeatherImage(Principal principal) {
    String userKey = principal.getName();
    WeatherDto response = weatherAiService.requestWeatherImage(userKey);
    if(response == null){
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    Weather weather=new Weather(response);

    WeatherDto savedDto=weatherService.saveWeather(weather,userKey);
    return ResponseEntity.ok(savedDto);
  }
  @GetMapping("/find-all-weather")
  public ResponseEntity<List<WeatherDto>> getAllWeather(Principal principal){
    String userCode = principal.getName();
    return ResponseEntity.ok(weatherService.findAllWeather(userCode));
  }
//
  @GetMapping("/find-one-weather/{Id}")
  public ResponseEntity<WeatherDto> getOneWeather(@PathVariable Long Id){
    return ResponseEntity.ok(weatherService.findWeather(Id));
  }


}
