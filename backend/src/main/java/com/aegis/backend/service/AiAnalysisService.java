package com.aegis.backend.service;

import com.aegis.backend.entity.ServiceMetric;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

@Service
public class AiAnalysisService {

    private final RestClient restClient;

    public AiAnalysisService(
            @Value("${ai.service.url}") String aiServiceUrl
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(System.getenv().getOrDefault(
        "AI_SERVICE_URL",
        "http://localhost:8000"
))
                .build();
    }

    public Map analyzeMetric(ServiceMetric metric) {

        Map<String, Object> requestBody = Map.of(
                "latency", metric.getLatency(),
                "errorRate", metric.getErrorRate(),
                "cpuUsage", metric.getCpuUsage(),
                "memoryUsage", metric.getMemoryUsage(),
                "throughput", metric.getThroughput()
        );

        return restClient.post()
                .uri("/analyze")
                .body(requestBody)
                .retrieve()
                .body(Map.class);
    }
    public Map analyzeRootCause(ServiceMetric metric) {

        Map<String, Object> requestBody = Map.of(
                "latency", metric.getLatency(),
                "errorRate", metric.getErrorRate(),
                "cpuUsage", metric.getCpuUsage(),
                "memoryUsage", metric.getMemoryUsage(),
                "throughput", metric.getThroughput()
        );

        return restClient.post()
                .uri("/root-cause")
                .body(requestBody)
                .retrieve()
                .body(Map.class);
    }
}