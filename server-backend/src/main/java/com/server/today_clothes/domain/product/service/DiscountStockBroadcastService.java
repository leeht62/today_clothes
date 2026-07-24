package com.server.today_clothes.domain.product.service;

import com.server.today_clothes.domain.product.dto.DiscountStockMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DiscountStockBroadcastService {

  private final SimpMessagingTemplate messagingTemplate;

  public void broadcast(Long productId, int remainingStock) {
    messagingTemplate.convertAndSend(
        "/topic/products/" + productId + "/discount-stock",
        new DiscountStockMessageDto(productId, remainingStock)
    );
  }
}