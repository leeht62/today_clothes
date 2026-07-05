package com.server.today_clothes.domain.board.controller;

import com.server.today_clothes.domain.board.dto.BoardDetailDto;
import com.server.today_clothes.domain.board.dto.BoardDto;
import com.server.today_clothes.domain.order.VO.Order;
import com.server.today_clothes.domain.order.dto.BoardOrderPaymentResponseDto;
import com.server.today_clothes.domain.order.dto.CreateBoardOrderRequestDto;
import com.server.today_clothes.domain.order.dto.OrderResponseDto;
import com.server.today_clothes.domain.order.service.OrderService;
import com.server.today_clothes.domain.payment.VO.Payment;
import com.server.today_clothes.domain.payment.dto.PaymentResponseDto;
import com.server.today_clothes.domain.payment.service.PaymentService;
import com.server.today_clothes.domain.user.VO.User;
import com.server.today_clothes.domain.user.mapper.UserMapper;
import com.server.today_clothes.domain.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
  private final OrderService orderService;
  private final PaymentService paymentService;
  //모든 Board 조회
  @GetMapping("/getBoard")
  public ResponseEntity<List<BoardDto>> getBoard(){
    log.info("Board성공");
    System.out.println("Board성공");
  return ResponseEntity.ok(boardService.findAllBoard());
  }

  @PostMapping("/seller/write")
  public ResponseEntity<BoardDto> createSellerProductBoard(
      @RequestBody BoardDto boardDto,
      Principal principal
  ) {
    String userCode = principal.getName();
    BoardDto response = boardService.saveSellerProductBoard(boardDto, userCode);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PostMapping("/{boardId}/orders")
  public ResponseEntity<BoardOrderPaymentResponseDto> createOrderFromBoard(
      @PathVariable Long boardId,
      @RequestBody CreateBoardOrderRequestDto request,
      Principal principal
  ) {
    String userName = principal.getName();
    User user = userMapper.findByUserName(userName).orElseThrow();

    Order order = orderService.createOrderFromBoard(
        user.getId(),
        boardId,
        request.getQuantity(),
        request.getOrderType()
    );

    Payment payment = paymentService.createPayment(order.getId(), user.getId());

    BoardOrderPaymentResponseDto response = new BoardOrderPaymentResponseDto(
        new OrderResponseDto(order),
        new PaymentResponseDto(payment)
    );

    return ResponseEntity.ok(response);
  }

  //Board 수정
  @PutMapping("/{boardId}/modify")
  public ResponseEntity<Void> update(@PathVariable Long boardId) {
    BoardDto boardDto=boardService.findBoard(boardId);
    boardService.update(boardDto);
    return ResponseEntity.ok(null);
  }

  @GetMapping("/{boardId}/read")
  public ResponseEntity<BoardDetailDto> readBoard(@PathVariable Long boardId) {
    return ResponseEntity.ok(boardService.findBoardDetail(boardId));
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
  public ResponseEntity<Void> unlike(
      @PathVariable Long boardId,
      Principal principal
  ) {
    boardService.unlikeBoard(boardId, principal.getName());
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
