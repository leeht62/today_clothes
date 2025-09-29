package com.server.today_clothes.dto;

import com.server.today_clothes.VO.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserLoginDto {
  private String userCode;
  private String password;

  public UserLoginDto(User user){
    this.userCode=user.getUserCode();
    this.password=user.getPassword();
  }
}
