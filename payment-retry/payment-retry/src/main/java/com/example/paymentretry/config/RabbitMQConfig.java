package com.example.paymentretry.config;

import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.core.MessageListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.MessageListenerContainer;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.Queue;


@Configuration
public class RabbitMQConfig {
//    @Value("${queue.payment.retry}")
//    private String retryQueue;
//
//    @Value("${queue.payment.notification}")
//    private String notificationQueue;
//
//    @Bean
//    public Queue retryQueue() {
//        return new Queue(retryQueue, true);  // Durable queue
//    }
//
//    @Bean
//    public Queue notificationQueue() {
//        return new Queue(notificationQueue, true);  // Durable queue
//    }
//
//    @Bean
//    public Jackson2JsonMessageConverter jsonMessageConverter() {
//        return new Jackson2JsonMessageConverter();  // Converts message to JSON
//    }
//
//    @Bean
//    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
//        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
//        rabbitTemplate.setMessageConverter(jsonMessageConverter());
//        return rabbitTemplate;
//    }
//
//    // Configure RabbitMQ listener
//    @Bean
//    public MessageListenerContainer messageListenerContainer(ConnectionFactory connectionFactory) {
//        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
//        container.setConnectionFactory(connectionFactory);
//        container.setQueues(retryQueue(), notificationQueue());
//        container.setMessageListener(messageListener());
//        return container;
//    }
//
//    @Bean
//    public MessageListener messageListener() {
//        return message -> {
//            // Process message
//            System.out.println("Received message: " + new String(message.getBody()));
//        };
//    }
}
