package com.server.today_clothes.mapper;

import com.server.today_clothes.VO.Board;
import com.server.today_clothes.VO.Comment;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommentMapper {
  List<Comment> findAll();

  Comment findById(Long id);
  void save(Comment comment);
  void update(Comment commnet);
  void deleteById(Long id);
}
