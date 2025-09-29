package com.server.today_clothes.VO;

import com.server.today_clothes.dto.UserDto;
import com.server.today_clothes.dto.UserLoginDto;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails{

  private Long id;

  private String username;

  private String userCode;

  private String password;

  private String role;


  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(role));
  }


  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  public User(UserDto userDto){
    this.username=userDto.getName();
    this.userCode=userDto.getUserCode();
    this.password=userDto.getPassword();
    this.role = "ROLE_USER";
  }

  public User(UserLoginDto userDto){
    this.userCode=userDto.getUserCode();
    this.password=userDto.getPassword();
  }
}
