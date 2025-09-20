package com.server.today_clothes.jwt;

import com.server.today_clothes.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class JwtToken {
  private String grantType;
  private String accessToken;
  private String refreshToken;
  private UserDto user;


}
