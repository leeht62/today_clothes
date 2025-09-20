package com.server.today_clothes.VO;

import com.server.today_clothes.dto.UserDto;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails{

  private Long id;

  private String username;

  @NotBlank(message = "아이디는 필수입니다.")
  private String userCode;

  @NotBlank(message = "비밀번호는 필수입니다.")
  private String password;


  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.emptyList();
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
  }
}
