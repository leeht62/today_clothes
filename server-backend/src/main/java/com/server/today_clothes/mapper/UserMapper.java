package com.server.today_clothes.mapper;

import com.server.today_clothes.VO.User;
import com.server.today_clothes.VO.Weather;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {
  List<User> findAll();

  User findById(String id);
  void save(User user);
  void update(User user);
  void deleteById(Long id);

}
