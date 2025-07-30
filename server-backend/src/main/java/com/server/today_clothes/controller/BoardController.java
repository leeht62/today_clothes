package com.server.today_clothes.controller;

import com.server.today_clothes.dto.BoardDto;
import com.server.today_clothes.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {
  private final BoardService boardService;
  //모든 Board 조회
  @GetMapping("/getBoard")
  public ResponseEntity<List<BoardDto>> getBoard(){
      return ResponseEntity.ok(boardService.findAllBoard());
  }
  //Board 1개씩 조회
  @GetMapping("/{boardId}/read")
  public ResponseEntity<BoardDto> ReadBoard(@PathVariable Long boardId){
    return ResponseEntity.ok(boardService.findBoard(boardId));
  }
  //Board 생성
  @PostMapping("/write")
  public ResponseEntity<BoardDto> create(@RequestBody BoardDto boardDto) {
    BoardDto boardDtos=boardService.saveBoard(boardDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(boardDtos);
  }
  //Board 수정
  @PutMapping("/{boardId}/modify")
  public ResponseEntity<Void> update(@PathVariable Long boardId) {
    BoardDto boardDto=boardService.findBoard(boardId);
    boardService.update(boardDto);
    return ResponseEntity.ok(null);
  }
  //Board 삭제
  @PatchMapping("/{boardId}/delete")
  public ResponseEntity<Void> delete(@PathVariable Long boardId) {
    boardService.deleteBoard(boardId);
    return ResponseEntity.ok(null);
  }

}
