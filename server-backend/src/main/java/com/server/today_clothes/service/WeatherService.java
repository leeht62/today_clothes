package com.server.today_clothes.service;

import com.server.today_clothes.VO.Weather;
import com.server.today_clothes.dto.WeatherDto;
import com.server.today_clothes.mapper.WeatherMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeatherService {
  private final WeatherMapper weatherMapper;

  public WeatherDto saveWeather(Weather weather){
    weatherMapper.save(weather);
    WeatherDto weatherDto=new WeatherDto(weather);
    return weatherDto;

  }

  public void deleteUser(Long id){
    weatherMapper.deleteById(id);
  }

  public WeatherDto findUser(Long id){
    Weather weather=weatherMapper.findById(id);
    WeatherDto weatherDto=new WeatherDto(weather);
    return weatherDto;
  }

  public List<WeatherDto> findAllUser(){
    List<Weather> weathers=weatherMapper.findAll();
    List<WeatherDto> WeatherDtos=new ArrayList<>();
    for(Weather weather : weathers){
      WeatherDto weatherDto=new WeatherDto(weather);
      WeatherDtos.add(weatherDto);
    }
    return WeatherDtos;
  }

}
