package com.server.today_clothes.service;

import com.server.today_clothes.VO.Board;
import com.server.today_clothes.VO.Comment;
import com.server.today_clothes.VO.User;
import com.server.today_clothes.dto.CommentDto;
import com.server.today_clothes.dto.MessageDto;
import com.server.today_clothes.mapper.BoardMapper;
import com.server.today_clothes.mapper.CommentMapper;
import com.server.today_clothes.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
  private final CommentMapper commentMapper;
  private final BoardMapper boardMapper;
  private final UserMapper userMapper;
  private final MessageService messageService;

  public CommentDto saveWeatherComment(CommentDto commentDto){
    Comment comment=new Comment(commentDto);
    commentMapper.SaveComment(comment);
    comment.setUser(commentDto.getUser());
    CommentDto commentDtos=new CommentDto(comment);
    return commentDtos;
  }
  public CommentDto saveBoardComment(CommentDto commentDto){
    Comment comment=new Comment(commentDto);
    commentMapper.SaveComment(comment);
    comment.setUser(commentDto.getUser());
    comment.setBoard(commentDto.getBoard());
    CommentDto commentDtos=new CommentDto(comment);
    return commentDtos;
  }
  public List<CommentDto> findComments(Long id){
    List<Comment> comments=commentMapper.findByBoardId(id);
    List<CommentDto> commentDtoList = new ArrayList<>();
    for(Comment comment : comments){
      CommentDto commentDto = new CommentDto(comment);
      commentDtoList.add(commentDto);
    }
    return commentDtoList;
  }
  public List<CommentDto> findAllBoard(){
    List<Comment> commentDtos=commentMapper.findAll();
    List<CommentDto> CommentDtoList = new ArrayList<>();
    for(Comment comment : commentDtos){
      CommentDto commentDto=new CommentDto(comment);
      CommentDtoList.add(commentDto);
    }
    return CommentDtoList;
  }
  public void updateWeather(CommentDto commentDto){
    Comment comment=new Comment(commentDto);
    commentMapper.UpdateComment(comment);
  }
  public void updateBoard(CommentDto commentDto){
    Comment comment=new Comment(commentDto);
    commentMapper.UpdateComment(comment);
  }
  public void delete(Long id){
    commentMapper.deleteById(id);
  }

  public CommentDto commentBoard(CommentDto commentDto, String userName, Long boardId) {
    User user = userMapper.findByUserName(userName).orElseThrow();
    commentDto.setUser(user);
    Board board = boardMapper.findById(boardId);
    commentDto.setBoard(board);
    Comment comment = new Comment(commentDto);
    commentMapper.SaveComment(comment);
    User boardUser = userMapper.findById(board.getUser().getId()); // user_id 칼럼 필요
    board.setUser(boardUser);

    MessageDto event = new MessageDto(
        "COMMENT",
        "회원 " + commentDto.getUser().getUserCode() + "님이 댓글을 남겼습니다: " + comment.getComment(),
        userName,
        board.getId()
    );

    // 4. Redis Pub/Sub으로 알림 발송
    messageService.publishNotification(userName, event);

    // 5. DTO 반환
    return new CommentDto(comment);
  }
}
