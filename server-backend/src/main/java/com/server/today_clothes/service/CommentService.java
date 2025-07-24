package com.server.today_clothes.service;

import com.server.today_clothes.VO.Board;
import com.server.today_clothes.VO.Comment;
import com.server.today_clothes.dto.BoardDto;
import com.server.today_clothes.dto.CommentDto;
import com.server.today_clothes.mapper.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
  private final CommentMapper commentMapper;

  public CommentDto saveWeatherComment(CommentDto commentDto){
    Comment comment=new Comment(commentDto);
    commentMapper.SaveComment(comment);
    comment.setUser(commentDto.getUser());
    comment.setWeather(commentDto.getWeather());
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
  public CommentDto findComment(Long id){
    Comment comment=commentMapper.findById(id);
    CommentDto commentDto=new CommentDto(comment);
    return commentDto;
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
}
