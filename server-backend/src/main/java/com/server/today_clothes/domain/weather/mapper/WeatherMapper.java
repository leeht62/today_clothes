package com.server.today_clothes.domain.weather.mapper;

import com.server.today_clothes.domain.weather.VO.Weather;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WeatherMapper {
  List<Weather> findAll(Long userId);

  Weather findById(Long id);
  void save(Weather weather);
  void update(Weather weather);
  void deleteById(Long id);
}
