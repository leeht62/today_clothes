package com.server.today_clothes.controller;

import com.server.today_clothes.VO.User;
import com.server.today_clothes.dto.BoardDto;
import com.server.today_clothes.mapper.UserMapper;
import com.server.today_clothes.service.BoardService;
import com.server.today_clothes.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {
  private final BoardService boardService;
  private final UserMapper userMapper;
  //모든 Board 조회
  @GetMapping()
  public ResponseEntity<List<BoardDto>> getBoard(){
    log.info("Board성공");
    System.out.println("Board성공");
  return ResponseEntity.ok(boardService.findAllBoard());
  }
  //Board 1개씩 조회
  @GetMapping("/{boardId}/read")

  public ResponseEntity<BoardDto> ReadBoard(@PathVariable Long boardId){
    return ResponseEntity.ok(boardService.findBoard(boardId));
  }
  //Board 생성
  @PostMapping("/write")
  public ResponseEntity<BoardDto> create(@RequestBody BoardDto boardDto,
                                         Principal principal) {
    String userCode = principal.getName();
    BoardDto boardDtos=boardService.saveBoard(boardDto,userCode);
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
  //게시글 좋아요
  @PostMapping("/{boardId}/like")
  public ResponseEntity<Void> like(
      @PathVariable Long boardId,
      Principal principal
  ) {
    String userCode = principal.getName();
    boardService.likeBoard(boardId,userCode);
    return ResponseEntity.ok().build();
  }
  // 좋아요 취소
  @PostMapping("/{boardId}/unlike")
  public ResponseEntity<Void> unlike(@PathVariable Long boardId) {
    boardService.unlikeBoard(boardId);
    return ResponseEntity.ok().build();
  }
  //게시글 순위
  @GetMapping("/top")
  public ResponseEntity<List<BoardDto>> topBoards(@RequestParam(defaultValue = "10") int count){
    return ResponseEntity.ok(boardService.findTopBoards(count));
  }
  @GetMapping("/{boardId}/likes/count")
  public ResponseEntity<Double> getBoardLikeCount(@PathVariable Long boardId) {
    Double count = boardService.getBoardLikeCount(boardId);
    return ResponseEntity.ok(count);
  }

}
