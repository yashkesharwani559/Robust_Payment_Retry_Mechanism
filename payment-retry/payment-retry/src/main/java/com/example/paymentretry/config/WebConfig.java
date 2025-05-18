package com.example.paymentretry.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // your frontend URL:
                .allowedOrigins("http://localhost:5173")
                // HTTP methods you want to allow:
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // allow all headers (or list only the ones you need)
                .allowedHeaders("*")
                // if you need to send cookies or auth headers:
                .allowCredentials(true)
                // how long browsers should cache the preflight response (in seconds)
                .maxAge(3600);
    }
}
