package com.server.today_clothes.mapper;

import com.server.today_clothes.VO.Weather;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WeatherMapper {
  List<Weather> findAll();

  Weather findById(Long id);
  void save(Weather weather);
  void update(Weather weather);
  void deleteById(Long id);
}
