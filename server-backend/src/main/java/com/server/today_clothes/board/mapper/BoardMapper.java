package com.server.today_clothes.board.mapper;

import com.server.today_clothes.board.VO.Board;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BoardMapper {
  List<Board> findAll();

  Board findById(Long id);
  void save(Board board);
  void update(Board board);
  void deleteById(Long id);

}
