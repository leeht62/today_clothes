package com.server.today_clothes.dto;


import com.server.today_clothes.VO.User;
import com.server.today_clothes.VO.Weather;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class WeatherDto {
  private Long Userid;
  private String weather_prompt;
  private String image;

  public WeatherDto(Weather weather){
    this.Userid=weather.getUserId();
    this.weather_prompt=weather.getWeatherPrompt();
    this.image=weather.getImage();
  }

  @Override
  public String toString() {
    return "WeatherAiResponse{" +
        "weather_prompt='" + weather_prompt + '\'' +
        ", image='" + image + '\'' +
        '}';
  }


}
