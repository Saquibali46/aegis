package com.aegis.backend.controller;

import com.aegis.backend.entity.ServiceMetric;
import com.aegis.backend.service.ServiceMetricService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/simulation")
public class MetricSimulationController {

    private final ServiceMetricService metricService;
    private final Random random = new Random();

    public MetricSimulationController(ServiceMetricService metricService) {
        this.metricService = metricService;
    }

    @PostMapping("/normal/{serviceId}")
    public List<ServiceMetric> generateNormalMetrics(
            @PathVariable Long serviceId,
            @RequestParam(defaultValue = "50") int count
    ) {

        List<ServiceMetric> metrics = new ArrayList<>();

        for (int i = 0; i < count; i++) {

            ServiceMetric metric = new ServiceMetric();

            metric.setLatency(100 + random.nextDouble() * 50);
            metric.setErrorRate(0.2 + random.nextDouble() * 1.0);
            metric.setCpuUsage(25 + random.nextDouble() * 25);
            metric.setMemoryUsage(40 + random.nextDouble() * 20);
            metric.setThroughput(700 + random.nextDouble() * 200);

            metrics.add(metricService.recordMetric(serviceId, metric));
        }

        return metrics;
    }
    @PostMapping("/abnormal/{serviceId}")
    public List<ServiceMetric> generateAbnormalMetrics(
            @PathVariable Long serviceId,
            @RequestParam(defaultValue = "10") int count
    ) {

        List<ServiceMetric> metrics = new ArrayList<>();

        for (int i = 0; i < count; i++) {

            ServiceMetric metric = new ServiceMetric();

            metric.setLatency(1200 + random.nextDouble() * 1800);
            metric.setErrorRate(8 + random.nextDouble() * 15);
            metric.setCpuUsage(80 + random.nextDouble() * 19);
            metric.setMemoryUsage(75 + random.nextDouble() * 20);
            metric.setThroughput(150 + random.nextDouble() * 250);

            metrics.add(metricService.recordMetric(serviceId, metric));
        }

        return metrics;
    }
}