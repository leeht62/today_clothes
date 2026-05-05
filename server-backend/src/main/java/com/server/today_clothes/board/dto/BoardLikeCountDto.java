package com.server.today_clothes.board.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BoardLikeCountDto {
  private Long boardId;
  private double likeCount;
}