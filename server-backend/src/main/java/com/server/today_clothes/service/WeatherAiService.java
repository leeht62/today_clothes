package com.server.today_clothes.service;

import com.server.today_clothes.dto.WeatherDto;
import org.springframework.beans.factory.annotation.Value;
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



  public WeatherDto requestWeatherImage() {
    String url = baseUrl;

    // POST 요청이지만 바디 없이 호출 (FastAPI 쪽에서도 body 없이 받도록 되어 있음)
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

    try {
      ResponseEntity<WeatherDto> response = restTemplate.exchange(
          url,
          HttpMethod.POST,
          requestEntity,
          WeatherDto.class
      );

      return response.getBody();
    } catch (Exception e) {
      System.out.println("FastAPI 요청 실패: " + e.getMessage());
      return null;
    }
  }

}
