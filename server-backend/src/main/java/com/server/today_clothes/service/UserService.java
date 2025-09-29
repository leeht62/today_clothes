package com.server.today_clothes.service;

import com.server.today_clothes.VO.User;
import com.server.today_clothes.dto.UserDto;
import com.server.today_clothes.jwt.JwtToken;
import com.server.today_clothes.jwt.JwtTokenProvider;
import com.server.today_clothes.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
  private final AuthenticationManagerBuilder authenticationManagerBuilder;
  private final CustomUserDetailsService customUserDetailsService;
  private final JwtTokenProvider jwtTokenProvider;
  private final UserMapper userMapper;
  private final PasswordEncoder passwordEncoder;

  @Transactional
  public JwtToken signIn(String username) {
    log.info("Jwt username1 = {}", username);
    UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
    log.info("Jwt userDetails= {}", userDetails);
    // 2. AuthenticationManager를 통해 인증 수행 (UserDetailsService 호출됨)
    Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    log.info("Jwt authentication= {}", authentication);
    SecurityContextHolder.getContext().setAuthentication(authentication);
    JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);
    log.info("Jwt token123= {}", jwtToken);

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
    log.info("User from mapper = {}", users);
    User user = userMapper.findByUserCode(users);
    log.info("findByUserCode의 user = {},{}",user.getUserCode(),user.getUsername());
    UserDto userDto=new UserDto(user);
    return userDto;
  }
  public UserDto findByUserName(String users){
    User user = userMapper.findByUserName(users).orElseThrow();
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
    User existingMember = userMapper.findByUserCode(user.getUserCode());
    if(existingMember!=null){
      throw new IllegalStateException("이미 가입된 회원입니다.");
    }
  }


}
