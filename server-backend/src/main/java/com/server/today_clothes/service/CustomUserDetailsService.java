package com.server.today_clothes.service;

import com.server.today_clothes.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService {
  private final UserMapper userMapper;
  private final PasswordEncoder passwordEncoder;

  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return userMapper.findByUserCode(username)
        .map(this::createUserDetails)
        .orElseThrow(() -> new UsernameNotFoundException("해당하는 회원을 찾을 수 없습니다."));
  }

  // 해당하는 User 의 데이터가 존재한다면 UserDetails 객체로 만들어서 return
  private UserDetails createUserDetails(com.server.today_clothes.VO.User user) {
    return User.builder()
        .username(user.getUsername())
        .password(passwordEncoder.encode(user.getPassword()))
        .build();
  }
}
