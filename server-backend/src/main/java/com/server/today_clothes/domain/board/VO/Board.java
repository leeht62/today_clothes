package com.server.today_clothes.domain.board.VO;
import com.server.today_clothes.domain.board.dto.BoardDto;
import com.server.today_clothes.domain.product.VO.Product;
import com.server.today_clothes.domain.user.VO.User;
import com.server.today_clothes.domain.weather.VO.Weather;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Board {
  private Long id;
  private User user;
  private Long userId;
  private String title;
  private String content;
  private Weather weather;
  private LocalDateTime date;
  private Long productId;
  private Product product;
  private Long weatherId;


  public Board(BoardDto boardDto) {
    this.title = boardDto.getTitle();
    this.content = boardDto.getContent();
    this.date = LocalDateTime.now();
    this.productId = boardDto.getProductId();
    this.weatherId = boardDto.getWeatherId();

    if (boardDto.getWeatherId() != null) {
      this.weather = new Weather();
      this.weather.setId(boardDto.getWeatherId());
    }
  }

}
