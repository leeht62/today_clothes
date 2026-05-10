package com.server.today_clothes.domain.seller.VO;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Seller {
  private Long id;
  private Long userId;
  private String shopName;
  private String address;
  private String phone;
  private LocalDateTime createdAt;
}
