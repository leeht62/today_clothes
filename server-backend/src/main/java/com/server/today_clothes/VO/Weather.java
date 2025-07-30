package com.server.today_clothes.VO;

import com.server.today_clothes.dto.UserDto;
import com.server.today_clothes.dto.WeatherDto;
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
  private String gpt_answer;

  private LocalDateTime createdAt;

  @PrePersist
  public void onCreate() {
    this.createdAt = LocalDateTime.now();
  }

  public Weather(WeatherDto weatherDto){
    this.userId=weatherDto.getUserId();
    this.gpt_answer=weatherDto.getGpt_answer();
    this.weatherPrompt=weatherDto.getWeather_prompt();
    this.image=weatherDto.getImage();
  }
}
