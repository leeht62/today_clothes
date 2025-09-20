package com.server.today_clothes.mapper;

import com.server.today_clothes.VO.Comment;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommentMapper {
  List<Comment> findAll();

  Comment findById(Long id);
  void SaveComment(Comment comment);
  void UpdateComment(Comment commnet);
  void deleteById(Long id);
}
