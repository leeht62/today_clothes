package com.server.today_clothes.domain.payment.service;

import com.server.today_clothes.domain.order.VO.Order;
import com.server.today_clothes.domain.order.mapper.OrderMapper;
import com.server.today_clothes.domain.payment.VO.Payment;
import com.server.today_clothes.domain.payment.VO.PaymentStatus;
import com.server.today_clothes.domain.payment.dto.TossConfirmRequestDto;
import com.server.today_clothes.domain.payment.infrastructure.TossPaymentClient;
import com.server.today_clothes.domain.payment.mapper.PaymentMapper;
import com.server.today_clothes.global.config.TossPaymentConfig;
import com.server.today_clothes.domain.product.service.ProductService;
import com.server.today_clothes.domain.order.VO.OrderStatus;
import com.server.today_clothes.domain.order.VO.OrderType;
import com.server.today_clothes.domain.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

  private final PaymentMapper paymentMapper;
  private final OrderMapper orderMapper;
  private final TossPaymentClient tossPaymentClient;
  private final ProductService productService;

  @Transactional
  public Payment createPayment(Long orderId, Long userId) {
    Order order = orderMapper.findById(orderId);

    if (order == null) {
      throw new IllegalArgumentException("존재하지 않는 주문입니다.");
    }

    if (order.getStatus() != OrderStatus.PENDING) {
      throw new IllegalStateException("결제 대기 상태의 주문만 결제할 수 있습니다.");
    }

    if (order.getReservedUntil() != null && order.getReservedUntil().isBefore(LocalDateTime.now())) {
      orderMapper.updateExpired(order.getId());
      throw new IllegalStateException("주문 결제 시간이 만료되었습니다.");
    }

    if (!order.getUserId().equals(userId)) {
      throw new IllegalArgumentException("주문자 정보가 일치하지 않습니다.");
    }

    Payment existingPayment = paymentMapper.findByOrderId(orderId);
    if (existingPayment != null) {
      return existingPayment;
    }

    Payment payment = new Payment();
    payment.setOrderId(order.getId());
    payment.setUserId(userId);
    payment.setTossOrderId(createTossOrderId(order.getId()));
    payment.setPaymentKey(null);
    payment.setIdempotencyKey(UUID.randomUUID().toString());
    payment.setAmount(order.getTotalAmount());
    payment.setStatus(PaymentStatus.PENDING);
    payment.setPaidAt(null);
    payment.setCreatedAt(LocalDateTime.now());
    payment.setUpdatedAt(LocalDateTime.now());

    paymentMapper.save(payment);

    return payment;
  }

  @Transactional
  public void completePayment(String tossOrderId, String paymentKey, Long amount) {
    Payment payment = paymentMapper.findByTossOrderId(tossOrderId);

    if (payment == null) {
      throw new IllegalArgumentException("존재하지 않는 결제 정보입니다.");
    }

    if (payment.getStatus() == PaymentStatus.SUCCESS) {
      return;
    }

    Order order = orderMapper.findById(payment.getOrderId());

    if (order == null) {
      throw new IllegalArgumentException("존재하지 않는 주문입니다.");
    }

    if (order.getStatus() != OrderStatus.PENDING) {
      throw new IllegalStateException("결제 대기 상태의 주문만 결제 완료 처리할 수 있습니다.");
    }

    if (order.getReservedUntil() != null && order.getReservedUntil().isBefore(LocalDateTime.now())) {
      paymentMapper.updateFailed(payment.getId());
      orderMapper.updateExpired(order.getId());
      throw new IllegalStateException("주문 결제 시간이 만료되었습니다.");
    }

    if (!payment.getAmount().equals(amount)) {
      paymentMapper.updateFailed(payment.getId());
      orderMapper.updateFailed(payment.getOrderId());
      throw new IllegalArgumentException("결제 금액이 일치하지 않습니다.");
    }

    TossConfirmRequestDto confirmRequest = new TossConfirmRequestDto(
        paymentKey,
        tossOrderId,
        amount
    );

    tossPaymentClient.confirm(confirmRequest, payment.getIdempotencyKey());

    if (order.getOrderType() == OrderType.NORMAL) {
      productService.decreaseStock(
          order.getProductId(),
          order.getQuantity(),
          "주문 결제 완료 - orderId: " + order.getId()
      );
    }

    paymentMapper.updateSuccess(payment.getId(), paymentKey);
    orderMapper.updatePaid(payment.getOrderId());
  }

  @Transactional
  public void failPayment(String tossOrderId) {
    Payment payment = paymentMapper.findByTossOrderId(tossOrderId);

    if (payment == null) {
      throw new IllegalArgumentException("존재하지 않는 결제 정보입니다.");
    }

    Order order = orderMapper.findById(payment.getOrderId());

    if (order == null) {
      throw new IllegalArgumentException("존재하지 않는 주문입니다.");
    }

    if (order.getStatus() == OrderStatus.PENDING && order.getOrderType() == OrderType.DISCOUNT) {
      productService.rollbackDiscountStock(
          order.getProductId(),
          order.getUserId(),
          order.getQuantity(),
          "할인 주문 결제 실패 재고 복구 - orderId: " + order.getId()
      );
    }


    paymentMapper.updateFailed(payment.getId());
    orderMapper.updateFailed(payment.getOrderId());
  }

  public Payment findPayment(Long paymentId) {
    Payment payment = paymentMapper.findById(paymentId);

    if (payment == null) {
      throw new IllegalArgumentException("존재하지 않는 결제 정보입니다.");
    }

    return payment;
  }

  public Payment findPaymentByOrderId(Long orderId) {
    Payment payment = paymentMapper.findByOrderId(orderId);

    if (payment == null) {
      throw new IllegalArgumentException("존재하지 않는 결제 정보입니다.");
    }

    return payment;
  }

  private String createTossOrderId(Long orderId) {
    return "ORDER-" + orderId + "-" + UUID.randomUUID().toString().substring(0, 8);
  }
}