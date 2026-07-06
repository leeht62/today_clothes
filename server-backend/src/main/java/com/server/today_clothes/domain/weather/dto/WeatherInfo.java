package com.server.today_clothes.domain.weather.dto;

import com.server.today_clothes.domain.weather.VO.Weather;
import lombok.Getter;

@Getter
public class WeatherInfo {
  private Long id;
  private String weatherPrompt;
  private String gptAnswer;
  private String image;

  public WeatherInfo(Weather weather) {
    this.id = weather.getId();
    this.weatherPrompt = weather.getWeatherPrompt();
    this.gptAnswer = weather.getGptAnswer();
    this.image = weather.getImage();
  }
}