package com.server.today_clothes.domain.user.dto;

import com.server.today_clothes.domain.user.VO.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserDto {
  private String username;
  private String userCode;
  private String password;

  public UserDto(User user){
    this.username=user.getUsername();
    this.userCode=user.getUserCode();
    this.password=user.getPassword();
  }
}
