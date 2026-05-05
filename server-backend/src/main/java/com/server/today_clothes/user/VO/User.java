package com.server.today_clothes.user.VO;

import com.server.today_clothes.user.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
