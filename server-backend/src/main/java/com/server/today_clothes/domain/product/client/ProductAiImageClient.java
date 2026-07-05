package com.server.today_clothes.domain.product.client;

import com.server.today_clothes.domain.product.dto.ProductAiImageRequestDto;
import com.server.today_clothes.domain.product.dto.ProductAiImageResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class ProductAiImageClient {

  private final RestClient restClient = RestClient.create();

  @Value("${fastapi.product-ai-image-url}")
  private String productAiImageUrl;

  public ProductAiImageResponseDto requestAiImage(ProductAiImageRequestDto request) {
    return restClient.post()
        .uri(productAiImageUrl)
        .contentType(MediaType.APPLICATION_JSON)
        .body(request)
        .retrieve()
        .body(ProductAiImageResponseDto.class);
  }
}
