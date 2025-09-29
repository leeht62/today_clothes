package com.server.today_clothes.service;

import com.server.today_clothes.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
  private final UserMapper userMapper;
  private final PasswordEncoder passwordEncoder;

  public UserDetails loadUserByUsername(String usercode) throws UsernameNotFoundException {
    return userMapper.findByUserCode(usercode)
        .orElseThrow(() -> new UsernameNotFoundException("해당하는 회원을 찾을 수 없습니다."));
  }

}
