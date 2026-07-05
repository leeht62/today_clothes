package com.server.today_clothes.domain.order.dto;

import com.server.today_clothes.domain.order.VO.OrderType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBoardOrderRequestDto {
  private Integer quantity;
  private OrderType orderType;
}
