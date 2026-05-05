package com.server.today_clothes.user.mapper;

import com.server.today_clothes.user.VO.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {
  List<User> findAll();

  User findById(Long id);
  void save(User user);
  void update(User user);
  void deleteById(Long id);
  Optional<User> findByUserCode(String userCode);
  Optional<User> findByUserName(String username);

}
