package com.server.today_clothes.dto;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class WeatherDto {
  private String weather_prompt;
  private String gpt_answer;
  private String image;

  @Override
  public String toString() {
    return "WeatherAiResponse{" +
        "weather_prompt='" + weather_prompt + '\'' +
        ", gpt_answer='" + gpt_answer + '\'' +
        ", image='" + image + '\'' +
        '}';
  }
}
