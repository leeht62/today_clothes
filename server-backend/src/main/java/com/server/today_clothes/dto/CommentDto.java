package com.server.today_clothes.dto;

import com.server.today_clothes.VO.Board;
import com.server.today_clothes.VO.Comment;
import com.server.today_clothes.VO.User;
import com.server.today_clothes.VO.Weather;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommentDto {
  private Long id;
  private String comment;
  private User user;
  private Board board;
  public CommentDto(Comment comment) {
    this.id = comment.getId();
    this.comment = comment.getComment();
    this.user=comment.getUser();
    this.board=comment.getBoard();
  }

}
