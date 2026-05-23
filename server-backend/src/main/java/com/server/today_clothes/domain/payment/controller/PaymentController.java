package com.server.today_clothes.domain.payment.controller;

import com.server.today_clothes.domain.payment.VO.Payment;
import com.server.today_clothes.domain.payment.dto.CreatePaymentRequestDto;
import com.server.today_clothes.domain.payment.dto.PaymentResponseDto;
import com.server.today_clothes.domain.payment.dto.PaymentSuccessRequestDto;
import com.server.today_clothes.domain.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

  private final PaymentService paymentService;

  // 결제 정보 생성
  @PostMapping
  public ResponseEntity<PaymentResponseDto> createPayment(@RequestBody CreatePaymentRequestDto request) {
    Payment payment = paymentService.createPayment(request.getOrderId(), request.getUserId());
    return ResponseEntity.ok(new PaymentResponseDto(payment));
  }

  // Toss 결제 성공 콜백
  @GetMapping("/success")
  public ResponseEntity<Void> paymentSuccess(PaymentSuccessRequestDto request) {
    paymentService.completePayment(
        request.getOrderId(),
        request.getPaymentKey(),
        request.getAmount()
    );
    return ResponseEntity.ok().build();
  }

  // Toss 결제 실패 콜백
  @GetMapping("/fail")
  public ResponseEntity<Void> paymentFail(@RequestParam String orderId) {
    paymentService.failPayment(orderId);
    return ResponseEntity.ok().build();
  }

  // 결제 단건 조회
  @GetMapping("/{paymentId}")
  public ResponseEntity<PaymentResponseDto> getPayment(@PathVariable Long paymentId) {
    Payment payment = paymentService.findPayment(paymentId);
    return ResponseEntity.ok(new PaymentResponseDto(payment));
  }

  // 주문 ID로 결제 조회
  @GetMapping("/orders/{orderId}")
  public ResponseEntity<PaymentResponseDto> getPaymentByOrderId(@PathVariable Long orderId) {
    Payment payment = paymentService.findPaymentByOrderId(orderId);
    return ResponseEntity.ok(new PaymentResponseDto(payment));
  }
}