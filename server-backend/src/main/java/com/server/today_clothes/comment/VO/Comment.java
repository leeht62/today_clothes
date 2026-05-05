package com.server.today_clothes.comment.VO;

import com.server.today_clothes.board.VO.Board;
import com.server.today_clothes.comment.dto.CommentDto;
import com.server.today_clothes.user.VO.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
  private Long id;
  private User user;
  private String comment;
  private Board board;
  private LocalDateTime createdAt;

  public Comment(CommentDto commentDto) {
    this.comment = commentDto.getComment();
    this.user=commentDto.getUser();
    this.board=commentDto.getBoard();
    this.createdAt =LocalDateTime.now();
  }


}
