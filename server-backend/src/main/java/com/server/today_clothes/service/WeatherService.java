package com.server.today_clothes.service;

import com.server.today_clothes.VO.User;
import com.server.today_clothes.VO.Weather;
import com.server.today_clothes.dto.WeatherDto;
import com.server.today_clothes.mapper.UserMapper;
import com.server.today_clothes.mapper.WeatherMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeatherService {
  private final WeatherMapper weatherMapper;
  private final UserMapper userMapper;

  public WeatherDto saveWeather(Weather weather){
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String userCode = authentication.getName();
    // userCode로 DB에서 사용자 조회
    User user = userMapper.findByUserCode(userCode)
        .orElseThrow(() -> new RuntimeException("사용자 없음"));
    weatherMapper.save(weather);
    weather.setUserId(user.getId());
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
