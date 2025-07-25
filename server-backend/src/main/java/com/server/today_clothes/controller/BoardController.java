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

  @GetMapping("/getBoard")
  public ResponseEntity<List<BoardDto>> getBoard(){
      return ResponseEntity.ok(boardService.findAllBoard());
  }

  @GetMapping("/{boardId}/read")
  public ResponseEntity<BoardDto> ReadBoard(@PathVariable Long boardId){
    return ResponseEntity.ok(boardService.findBoard(boardId));
  }

  @PostMapping("/write")
  public ResponseEntity<BoardDto> create(@RequestBody BoardDto boardDto) {
    BoardDto boardDtos=boardService.saveBoard(boardDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(boardDtos);
  }

  @PutMapping("/{boardId}/modify")
  public ResponseEntity<Void> update(@PathVariable Long boardId) {
    BoardDto boardDto=boardService.findBoard(boardId);
    boardService.update(boardDto);
    return ResponseEntity.ok(null);
  }
  @PatchMapping("/{boardId}/delete")
  public ResponseEntity<Void> delete(@PathVariable Long boardId) {
    boardService.deleteBoard(boardId);
    return ResponseEntity.ok(null);
  }

}
