package com.server.today_clothes.controller;

import com.server.today_clothes.VO.Board;
import com.server.today_clothes.dto.BoardDto;
import com.server.today_clothes.dto.CommentDto;
import com.server.today_clothes.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {
  private final CommentService commentService;

  @GetMapping("/{boardId}/comment")
  public ResponseEntity<List<CommentDto>> getComment(@PathVariable Long boardId){
    return ResponseEntity.ok(commentService.findComments(boardId));
  }
  @PostMapping("/{boardId}/weatherComments")
  public ResponseEntity<CommentDto> createWeatherComment(CommentDto commentDto, Principal principal){
    String userName = principal.getName();
    CommentDto commentDtos = commentService.saveWeatherComment(commentDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(commentDtos);
  }
  @PostMapping("/{boardId}/boardComments")
  public ResponseEntity<CommentDto> createBoardComment(CommentDto commentDto){
    CommentDto commentDtos = commentService.saveBoardComment(commentDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(commentDtos);
  }
  @PutMapping("/{boardId}/boardComments/{commentId}")
  public ResponseEntity<CommentDto> updateBoard(CommentDto commentDto){
    commentService.updateBoard(commentDto);
    return ResponseEntity.ok(null);
  }
  @PatchMapping("/admin/{commentId}/deletecomment")
  public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
    commentService.delete(commentId);
    return ResponseEntity.ok(null);
  }
  @PostMapping("/{boardId}/comment")
  public ResponseEntity<CommentDto> commentBoard(@PathVariable Long boardId
      ,@RequestBody CommentDto commentDto
      ,Principal principal) {
    String userName = principal.getName();
    CommentDto result = commentService.commentBoard(commentDto,userName,boardId);
    return ResponseEntity.status(HttpStatus.CREATED).body(result);
  }
}
