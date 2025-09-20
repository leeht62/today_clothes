package com.server.today_clothes.notification.subscriber;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.today_clothes.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BoardSubscriber implements MessageListener {

  private final ObjectMapper objectMapper;
  private final SimpMessagingTemplate simpMessagingTemplate;


  @Override
  public void onMessage(Message message, byte[] pattern) {
    try {
      String json = new String(message.getBody());
      MessageDto event = objectMapper.readValue(json, MessageDto.class);

      log.info("Redis SUB Channel : {}", event.getReceiver());
      log.info("Message : {}", event.getMessage());

      // WebSocket으로 해당 회원에게 전송
      simpMessagingTemplate.convertAndSend("/topic/notifications/" + event.getReceiver(), event);
    } catch (Exception e) {
      log.error("Redis Subscribe Error: {}", e.getMessage());
    }
  }
}