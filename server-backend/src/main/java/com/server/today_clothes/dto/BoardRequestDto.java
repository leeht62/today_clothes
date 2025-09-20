package com.server.today_clothes.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BoardRequestDto {
  private String title;
  private String content;
  private Long weatherId;  // 글 작성할 때 필요한 값만
}