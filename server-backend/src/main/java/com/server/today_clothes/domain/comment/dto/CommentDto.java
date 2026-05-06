package com.server.today_clothes.domain.comment.dto;

import com.server.today_clothes.domain.board.VO.Board;
import com.server.today_clothes.domain.comment.VO.Comment;
import com.server.today_clothes.domain.user.VO.User;
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
