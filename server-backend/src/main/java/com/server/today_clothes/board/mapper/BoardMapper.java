package com.server.today_clothes.board.mapper;

import com.server.today_clothes.board.VO.Board;
import com.server.today_clothes.board.dto.BoardLikeCountDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface BoardMapper {
  List<Board> findAll();

  Board findById(Long id);
  void save(Board board);
  void update(Board board);
  void deleteById(Long id);
  void insertLike(@Param("userId") Long userId, @Param("boardId") Long boardId);
  void deleteLike(@Param("userId") Long userId, @Param("boardId") Long boardId);
  List<BoardLikeCountDto> findAllLikeCounts();
}
