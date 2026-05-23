package com.server.today_clothes.domain.payment.mapper;

import com.server.today_clothes.domain.payment.VO.Payment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PaymentMapper {

  void save(Payment payment);

  Payment findById(Long id);

  Payment findByOrderId(Long orderId);

  Payment findByTossOrderId(String tossOrderId);

  Payment findByPaymentKey(String paymentKey);

  Payment findByIdempotencyKey(String idempotencyKey);

  void updateStatus(@Param("id") Long id, @Param("status") String status);

  void updateSuccess(@Param("id") Long id, @Param("paymentKey") String paymentKey);

  void updateFailed(@Param("id") Long id);
}