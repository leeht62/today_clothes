package com.server.today_clothes.domain.payment.infrastructure;

import com.server.today_clothes.global.config.TossPaymentConfig;
import com.server.today_clothes.domain.payment.dto.TossConfirmRequestDto;
import com.server.today_clothes.domain.payment.dto.TossConfirmResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
@RequiredArgsConstructor
public class TossPaymentClient {

  private final TossPaymentConfig tossPaymentConfig;

  private final RestClient restClient = RestClient.create();

  public TossConfirmResponseDto confirm(TossConfirmRequestDto request, String idempotencyKey) {
    String encodedSecretKey = Base64.getEncoder()
        .encodeToString((tossPaymentConfig.getSecretKey() + ":").getBytes(StandardCharsets.UTF_8));

    TossConfirmResponseDto response = restClient.post()
        .uri(tossPaymentConfig.getConfirmUrl())
        .header(HttpHeaders.AUTHORIZATION, "Basic " + encodedSecretKey)
        .header("Idempotency-Key", idempotencyKey)
        .contentType(MediaType.APPLICATION_JSON)
        .body(request)
        .retrieve()
        .body(TossConfirmResponseDto.class);

    if (response == null) {
      throw new IllegalStateException("결제 응답 바디가 비어 있습니다.");
    }

    return response;
  }
}