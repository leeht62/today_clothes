package com.server.today_clothes.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.server.today_clothes.VO.Weather;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class WeatherDto {
  private Long id;
  private Long userId;
  private String weather_prompt;

  @JsonProperty("gpt_answer")
  private String gptAnswer;
  private String image;

  public WeatherDto(Weather weather){
    this.id = weather.getId();
    this.userId=weather.getUserId();
    this.gptAnswer = weather.getGptAnswer();
    this.weather_prompt=weather.getWeatherPrompt();
    this.image=weather.getImage();
  }

  @Override
  public String toString() {
    return "WeatherDto{" +
        "weather_prompt='" + weather_prompt + '\'' +
        ", gptAnswer='" + gptAnswer + '\'' +
        ", image='" + (image != null ? "[image data]" : null) + '\'' +
        '}';
  }


}
