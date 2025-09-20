package com.server.today_clothes.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.today_clothes.dto.WeatherDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class WeatherAiService {

  @Value("${fastapi_Url}")
  private String baseUrl;

  RestTemplate restTemplate = new RestTemplate();

  public WeatherAiService() {
    this.restTemplate = new RestTemplate();
  }


  @Cacheable(value = "weather", key = "#userKey", unless = "#result == null")
  public WeatherDto requestWeatherImage(String userKey) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<Void> requestEntity = new HttpEntity<>(headers);


      ResponseEntity<Object> response = restTemplate.exchange(
          baseUrl,
          HttpMethod.POST,
          requestEntity,
          Object.class
      );

      ObjectMapper mapper = new ObjectMapper();
      WeatherDto weather;
      try {
        weather = mapper.convertValue(response.getBody(), WeatherDto.class);
      } catch (IllegalArgumentException e) {
        System.out.println("JSON → DTO 변환 실패: " + e.getMessage());
        return null;
      }

      return weather;
    }



}
