package com.server.today_clothes.domain.board.mapper;

import com.server.today_clothes.domain.board.VO.Board;
import com.server.today_clothes.domain.board.dto.BoardLikeCountDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

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
