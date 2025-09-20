package com.server.today_clothes.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.today_clothes.dto.MessageDto;
import com.server.today_clothes.notification.subscriber.BoardSubscriber;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageService {
  private final RedisMessageListenerContainer redisMessageListenerContainer;
  private final RedisService redisService;
  private final BoardSubscriber boardSubscriber;
  private final ObjectMapper objectMapper;

  // 이벤트 발행
  public void publishNotification(String receiverId, MessageDto event) {
    ChannelTopic topic = new ChannelTopic("notifications:" + receiverId);

    // 구독 등록
    redisMessageListenerContainer.addMessageListener(boardSubscriber, topic);

    redisService.publish(topic, event);

  }
}
