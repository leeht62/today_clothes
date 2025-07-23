package com.server.today_clothes.service;

import com.server.today_clothes.VO.User;
import com.server.today_clothes.dto.UserDto;
import com.server.today_clothes.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserMapper userMapper;

  public UserDto saveUser(User user){
    userMapper.save(user);
    UserDto userDto=new UserDto(user);
    return userDto;

  }

  public void deleteUser(Long id){
    userMapper.deleteById(id);
  }

  public UserDto findUser(Long id){
    User user=userMapper.findById(id);
    UserDto userDto=new UserDto(user);
    return userDto;
  }

  public List<UserDto> findAllUser(){
    List<User> users=userMapper.findAll();
    List<UserDto> userDtos=new ArrayList<>();
    for(User user : users){
      UserDto userDto=new UserDto(user);
      userDtos.add(userDto);
    }
    return userDtos;
  }


}
