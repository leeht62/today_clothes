package com.server.today_clothes.VO;

import com.server.today_clothes.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User{

  private Long id;

  private String username;

  private String userCode;

  private String password;

  private String role;


  public User(UserDto userDto){
    this.username=userDto.getUsername();
    this.userCode=userDto.getUserCode();
    this.password=userDto.getPassword();
    this.role = "ROLE_USER";
  }

}
