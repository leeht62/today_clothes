package com.server.today_clothes.dto;


import com.server.today_clothes.VO.User;
import com.server.today_clothes.VO.Weather;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class WeatherDto {
  private Long userId;
  private String weather_prompt;
  private String gpt_answer;
  private String image;

  public WeatherDto(Weather weather){
    this.userId=weather.getUserId();
    this.gpt_answer=weather.getImage();
    this.weather_prompt=weather.getWeatherPrompt();
    this.image=weather.getImage();
  }

  @Override
  public String toString() {
    return "WeatherDto{" +
        "weather_prompt='" + weather_prompt + '\'' +
        ", gpt_answer='" + gpt_answer + '\'' +
        ", image='" + (image != null ? "[image data]" : null) + '\'' +
        '}';
  }


}
