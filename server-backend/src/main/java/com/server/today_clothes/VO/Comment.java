package com.server.today_clothes.VO;

import com.server.today_clothes.dto.CommentDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
  private Long id;
  private User user;
  private Weather weather;
  private String comment;
  private Board board;

  public Comment(CommentDto commentDto) {
    this.comment = commentDto.getComment();
  }


}
