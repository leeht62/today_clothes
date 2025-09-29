package com.server.today_clothes.service;

import com.server.today_clothes.VO.User;
import com.server.today_clothes.dto.UserDto;
import com.server.today_clothes.jwt.JwtToken;
import com.server.today_clothes.jwt.JwtTokenProvider;
import com.server.today_clothes.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
  private final AuthenticationManagerBuilder authenticationManagerBuilder;
  private final CustomUserDetailsService customUserDetailsService;
  private final JwtTokenProvider jwtTokenProvider;
  private final UserMapper userMapper;
  private final PasswordEncoder passwordEncoder;

  @Transactional
  public JwtToken signIn(String userCode, String password) {
    UsernamePasswordAuthenticationToken authenticationToken =
        new UsernamePasswordAuthenticationToken(userCode, password);
    JwtToken jwtToken = jwtTokenProvider.generateToken(authenticationToken);

    return jwtToken;
  }


  @Transactional
  public UserDto saveUser(UserDto userDto){
    User user=new User(userDto);
    Duplicate(user);
    String password=user.getPassword();
    String encPassword = passwordEncoder.encode(password);
    user.setPassword(encPassword);
    userMapper.save(user);
    UserDto userDtos=new UserDto(user);
    return userDtos;

  }

  public void deleteUser(Long id){
    userMapper.deleteById(id);
  }

  public UserDto findUser(Long id){
    User user=userMapper.findById(id);
    UserDto userDto=new UserDto(user);
    return userDto;
  }
  public UserDto findByUserCode(String users){
    User user = userMapper.findByUserCode(users)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + users));
    UserDto userDto=new UserDto(user);
    return userDto;
  }
  public UserDto findByUserName(String users){
    User user = userMapper.findByUserName(users);
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

  private void Duplicate(User user){
    Optional<User> existingMember = userMapper.findByUserCode(user.getUserCode());
    if(existingMember.isPresent()){
      throw new IllegalStateException("이미 가입된 회원입니다.");
    }
  }


}
