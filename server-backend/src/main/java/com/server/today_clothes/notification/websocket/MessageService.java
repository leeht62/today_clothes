package com.server.today_clothes.notification.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.today_clothes.comment.dto.MessageDto;
import com.server.today_clothes.notification.subscriber.BoardSubscriber;
import com.server.today_clothes.config.RedisService;
import lombok.RequiredArgsConstructor;
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
