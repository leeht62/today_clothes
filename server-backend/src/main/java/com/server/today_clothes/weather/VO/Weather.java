package com.server.today_clothes.weather.VO;

import com.server.today_clothes.weather.dto.WeatherDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Weather {
  private Long id;
  private Long userId;
  private String weatherPrompt;
  private String image;
  private String gptAnswer;

  private LocalDateTime createdAt;

  @PrePersist
  public void onCreate() {
    this.createdAt = LocalDateTime.now();
  }

  public Weather(WeatherDto weatherDto){
    this.userId=weatherDto.getUserId();
    this.gptAnswer=weatherDto.getGptAnswer();
    this.weatherPrompt=weatherDto.getWeather_prompt();
    this.image=weatherDto.getImage();
  }
}
