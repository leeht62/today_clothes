package com.server.today_clothes.service;

import com.server.today_clothes.VO.User;
import com.server.today_clothes.VO.Weather;
import com.server.today_clothes.dto.WeatherDto;
import com.server.today_clothes.mapper.UserMapper;
import com.server.today_clothes.mapper.WeatherMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeatherService {
  private final WeatherMapper weatherMapper;
  private final UserMapper userMapper;

  public WeatherDto saveWeather(Weather weather,String userName){
    // userCode로 DB에서 사용자 조회
    User user = userMapper.findByUserName(userName);
    weather.setUserId(user.getId());
    weatherMapper.save(weather);
    WeatherDto weatherDto=new WeatherDto(weather);
    return weatherDto;

  }

  public void deleteWeather(Long id){
    weatherMapper.deleteById(id);
  }

  public WeatherDto findWeather(Long id){
    Weather weather=weatherMapper.findById(id);
    WeatherDto weatherDto=new WeatherDto(weather);
    return weatherDto;
  }

  public List<WeatherDto> findAllWeather(){
    List<Weather> weathers=weatherMapper.findAll();
    List<WeatherDto> WeatherDtos=new ArrayList<>();
    for(Weather weather : weathers){
      WeatherDto weatherDto=new WeatherDto(weather);
      WeatherDtos.add(weatherDto);
    }
    return WeatherDtos;
  }

}
