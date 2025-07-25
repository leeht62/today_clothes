package com.server.today_clothes.dto;

import com.server.today_clothes.VO.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserDto {
  private String name;
  private String userCode;
  private String password;

  public UserDto(User user){
    this.name=user.getUsername();
    this.userCode=user.getUserCode();
    this.password=user.getPassword();
  }
}
