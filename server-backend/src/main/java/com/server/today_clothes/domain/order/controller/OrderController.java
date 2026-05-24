package com.server.today_clothes.domain.order.controller;

import com.server.today_clothes.domain.order.VO.Order;
import com.server.today_clothes.domain.order.dto.CreateOrderRequestDto;
import com.server.today_clothes.domain.order.dto.OrderResponseDto;
import com.server.today_clothes.domain.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

  // 주문 생성
  @PostMapping
  public ResponseEntity<OrderResponseDto> createOrder(@RequestBody CreateOrderRequestDto request) {
    Order order = orderService.createOrder(
        request.getUserId(),
        request.getProductId(),
        request.getQuantity(),
        request.getOrderType()
    );

    return ResponseEntity.ok(new OrderResponseDto(order));
  }

  // 주문 단건 조회
  @GetMapping("/{orderId}")
  public ResponseEntity<OrderResponseDto> getOrder(@PathVariable Long orderId) {
    Order order = orderService.findOrder(orderId);
    return ResponseEntity.ok(new OrderResponseDto(order));
  }

  // 사용자별 주문 목록 조회
  @GetMapping("/users/{userId}")
  public ResponseEntity<List<OrderResponseDto>> getOrdersByUserId(@PathVariable Long userId) {
    List<OrderResponseDto> orders = orderService.findOrdersByUserId(userId)
        .stream()
        .map(OrderResponseDto::new)
        .collect(Collectors.toList());

    return ResponseEntity.ok(orders);
  }

  // 주문 취소
  @PatchMapping("/{orderId}/cancel")
  public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
    orderService.cancelOrder(orderId);
    return ResponseEntity.ok().build();
  }
}