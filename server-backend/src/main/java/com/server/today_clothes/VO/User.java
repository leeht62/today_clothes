package com.server.today_clothes.VO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

  private int id;

  @NotBlank(message = "아이디는 필수입니다.")
  private String userCode;

  @NotBlank(message = "비밀번호는 필수입니다.")
  private String password;

  private String name;
}
