package com.server.today_clothes.VO;
import com.server.today_clothes.dto.BoardDto;
import com.server.today_clothes.dto.CommentDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Board {
  private Long id;
  private User user;
  private Long userId;
  private String title;
  private String content;
  private Weather weather;
  private LocalDateTime date;


  public Board(BoardDto boardDto) {
    this.title = boardDto.getTitle();
    this.content = boardDto.getContent();
    this.date =LocalDateTime.now();
    this.weather = new Weather();
    this.weather.setId(boardDto.getWeatherId());

  }

}
