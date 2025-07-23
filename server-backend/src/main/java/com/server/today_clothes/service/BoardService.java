package com.server.today_clothes.service;


import com.server.today_clothes.VO.Board;
import com.server.today_clothes.dto.BoardDto;
import com.server.today_clothes.mapper.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {
  private final BoardMapper boardMapper;

  public BoardDto saveBoard(Board board){
    boardMapper.save(board);
    BoardDto boardDtos = new BoardDto(board);
    return boardDtos;
  }

  public void deleteBoard(Long id){
    boardMapper.deleteById(id);
  }

  public BoardDto findBoard(Long id){
    Board board=boardMapper.findById(id);
    BoardDto boardDto=new BoardDto(board);
    return boardDto;
  }

  public List<BoardDto> findAllBoard(){
    List<Board> boardDtos=boardMapper.findAll();
    List<BoardDto> BoardDtoList = new ArrayList<>();
    for(Board board : boardDtos){
      BoardDto mainDto = new BoardDto(board);
      BoardDtoList.add(mainDto);
    }
    return BoardDtoList;
  }

  public void update(Board board){
    boardMapper.update(board);
  }
}
