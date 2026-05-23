package com.server.today_clothes.domain.order.mapper;

import com.server.today_clothes.domain.order.VO.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderMapper {

  void save(Order order);

  Order findById(Long id);

  List<Order> findAllByUserId(Long userId);

  List<Order> findAllByProductId(Long productId);

  void updateStatus(@Param("id") Long id, @Param("status") String status);

  void updatePaid(Long id);

  void updateFailed(Long id);

  void updateCanceled(Long id);

  void updateExpired(Long id);
}