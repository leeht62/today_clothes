package com.server.today_clothes.domain.board.dto;

import com.server.today_clothes.domain.board.VO.Board;
import com.server.today_clothes.domain.weather.dto.WeatherInfo;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BoardDetailDto {
  private Long id;
  private String title;
  private String content;
  private LocalDateTime date;

  private Long productId;
  private ProductInfo product;

  private Long weatherId;
  private WeatherInfo weather;

  public BoardDetailDto(Board board) {
    this.id = board.getId();
    this.title = board.getTitle();
    this.content = board.getContent();
    this.date = board.getDate();

    this.productId = board.getProductId();
    if (board.getProduct() != null) {
      this.product = new ProductInfo(board);
    }

    this.weatherId = board.getWeatherId();
    if (board.getWeather() != null) {
      this.weather = new WeatherInfo(board.getWeather());
    }
  }
}