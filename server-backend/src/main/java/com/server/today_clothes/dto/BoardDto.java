package com.server.today_clothes.dto;


import com.server.today_clothes.VO.Board;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class BoardDto {
  private Long id;
  private LocalDateTime date;
  private String title;
  private String content;
  private String userCode;
  private String name;
  private Long weatherId;


  public BoardDto(Board board) {
    this.id = board.getId();
    this.title = board.getTitle();
    this.content = board.getContent();
    this.date = board.getDate();
    this.userCode = board.getUser().getUserCode();
    this.name =  board.getUser().getUsername();
    this.weatherId = board.getWeather() != null ? board.getWeather().getId() : null;
  }
}
