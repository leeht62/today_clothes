package com.server.today_clothes.domain.order.service;

import com.server.today_clothes.domain.order.VO.Order;
import com.server.today_clothes.domain.order.VO.OrderStatus;
import com.server.today_clothes.domain.order.VO.OrderType;
import com.server.today_clothes.domain.order.mapper.OrderMapper;
import com.server.today_clothes.domain.product.VO.Product;
import com.server.today_clothes.domain.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

  private final OrderMapper orderMapper;
  private final ProductService productService;

  @Transactional
  public Order createOrder(Long userId, Long productId, Integer quantity, OrderType orderType) {
    if (quantity == null || quantity <= 0) {
      throw new IllegalArgumentException("주문 수량은 1개 이상이어야 합니다.");
    }

    Product product = productService.findProduct(productId);

    Long unitPrice = Long.valueOf(product.getSalePrice());
    Long discountPrice = null;
    Long finalUnitPrice = unitPrice;

    if (orderType == OrderType.DISCOUNT) {
      if (product.getDiscountedPrice() == null) {
        throw new IllegalArgumentException("할인 상품이 아닙니다.");
      }

      if (product.getDiscountedStock() == null || product.getDiscountedStock() < quantity) {
        throw new IllegalStateException("할인 재고가 부족합니다.");
      }

      discountPrice = Long.valueOf(product.getDiscountedPrice());
      finalUnitPrice = discountPrice;
    } else {
      if (product.getStock() < quantity) {
        throw new IllegalStateException("재고가 부족합니다.");
      }
    }

    Order order = new Order();
    order.setUserId(userId);
    order.setProductId(productId);
    order.setQuantity(quantity);
    order.setUnitPrice(unitPrice);
    order.setDiscountPrice(discountPrice);
    order.setOrderType(orderType);
    order.setTotalAmount(finalUnitPrice * quantity);
    order.setStatus(OrderStatus.PENDING);
    order.setReservedUntil(LocalDateTime.now().plusMinutes(10));
    order.setCreatedAt(LocalDateTime.now());
    order.setUpdatedAt(LocalDateTime.now());

    orderMapper.save(order);

    return order;
  }

  public Order findOrder(Long orderId) {
    Order order = orderMapper.findById(orderId);

    if (order == null) {
      throw new IllegalArgumentException("존재하지 않는 주문입니다.");
    }

    return order;
  }

  public List<Order> findOrdersByUserId(Long userId) {
    return orderMapper.findAllByUserId(userId);
  }

  @Transactional
  public void markAsPaid(Long orderId) {
    Order order = findOrder(orderId);

    if (order.getStatus() == OrderStatus.PAID) {
      return;
    }

    if (order.getStatus() != OrderStatus.PENDING) {
      throw new IllegalStateException("결제 대기 상태의 주문만 결제 완료 처리할 수 있습니다.");
    }

    orderMapper.updatePaid(orderId);
  }

  @Transactional
  public void markAsFailed(Long orderId) {
    Order order = findOrder(orderId);

    if (order.getStatus() == OrderStatus.PAID) {
      throw new IllegalStateException("이미 결제 완료된 주문은 실패 처리할 수 없습니다.");
    }

    orderMapper.updateFailed(orderId);
  }

  @Transactional
  public void cancelOrder(Long orderId) {
    Order order = findOrder(orderId);

    if (order.getStatus() == OrderStatus.PAID) {
      throw new IllegalStateException("이미 결제 완료된 주문은 일반 취소할 수 없습니다. 환불 처리가 필요합니다.");
    }

    if (order.getStatus() == OrderStatus.CANCELED) {
      return;
    }

    orderMapper.updateCanceled(orderId);
  }

  @Transactional
  public void expireOrder(Long orderId) {
    Order order = findOrder(orderId);

    if (order.getStatus() != OrderStatus.PENDING) {
      return;
    }

    orderMapper.updateExpired(orderId);
  }
}