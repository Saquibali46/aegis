package com.aegis.backend.controller;

import com.aegis.backend.entity.ServiceMetric;
import com.aegis.backend.service.ServiceMetricService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
public class ServiceMetricController {

    private final ServiceMetricService metricService;

    public ServiceMetricController(ServiceMetricService metricService) {
        this.metricService = metricService;
    }

    @PostMapping("/service/{serviceId}")
    public Object recordMetric(
            @PathVariable Long serviceId,
            @RequestBody ServiceMetric metric
    ) {
        return metricService.recordAndAnalyzeMetric(serviceId, metric);
    }

    @GetMapping("/service/{serviceId}")
    public List<ServiceMetric> getMetricsForService(
            @PathVariable Long serviceId
    ) {
        return metricService.getMetricsForService(serviceId);
    }
}