package com.server.today_clothes.global.config;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DiscountStockReserveResult {
  private int code;
  private int remainingStock;

  public boolean isSuccess() {
    return code == 1;
  }

  public static DiscountStockReserveResult success(int remainingStock) {
    return new DiscountStockReserveResult(1, remainingStock);
  }

  public static DiscountStockReserveResult soldOut() {
    return new DiscountStockReserveResult(-1, 0);
  }

  public static DiscountStockReserveResult duplicated() {
    return new DiscountStockReserveResult(-2, 0);
  }
}