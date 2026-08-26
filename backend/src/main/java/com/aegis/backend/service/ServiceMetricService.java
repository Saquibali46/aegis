package com.aegis.backend.service;

import com.aegis.backend.entity.MonitoredService;
import com.aegis.backend.entity.ServiceMetric;
import com.aegis.backend.repository.MonitoredServiceRepository;
import com.aegis.backend.repository.ServiceMetricRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import com.aegis.backend.entity.Incident;
import com.aegis.backend.entity.IncidentSeverity;
import com.aegis.backend.entity.IncidentStatus;

import java.util.Map;

import java.util.List;

@Service
public class ServiceMetricService {

    private final ServiceMetricRepository metricRepository;
    private final MonitoredServiceRepository serviceRepository;
    private final AiAnalysisService aiAnalysisService;
    private final IncidentService incidentService;



    public ServiceMetric recordMetric(Long serviceId, @NonNull ServiceMetric metric) {

        MonitoredService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        metric.setService(service);

        ServiceMetric savedMetric = metricRepository.save(metric);

        if (
                metric.getLatency() >= 3000 ||
                        metric.getErrorRate() >= 20 ||
                        metric.getCpuUsage() >= 90 ||
                        metric.getMemoryUsage() >= 90
        ) {
            service.setStatus("CRITICAL");
        }
        else if (
                metric.getLatency() >= 1000 ||
                        metric.getErrorRate() >= 10 ||
                        metric.getCpuUsage() >= 75 ||
                        metric.getMemoryUsage() >= 80
        ) {
            service.setStatus("DEGRADED");
        }
        else {
            service.setStatus("HEALTHY");
        }

        serviceRepository.save(service);

        return savedMetric;
    }

    public List<ServiceMetric> getMetricsForService(Long serviceId) {
        return metricRepository
                .findByServiceIdOrderByRecordedAtDesc(serviceId);
    }
    public ServiceMetricService(
            ServiceMetricRepository metricRepository,
            MonitoredServiceRepository serviceRepository,
            AiAnalysisService aiAnalysisService,
            IncidentService incidentService
    ) {
        this.metricRepository = metricRepository;
        this.serviceRepository = serviceRepository;
        this.aiAnalysisService = aiAnalysisService;
        this.incidentService = incidentService;
    }
    public Object recordAndAnalyzeMetric(Long serviceId, ServiceMetric metric) {

    ServiceMetric savedMetric = recordMetric(serviceId, metric);

    Map aiResult;

    try {
        aiResult = aiAnalysisService.analyzeMetric(savedMetric);
    } catch (Exception e) {
        System.err.println("AI anomaly analysis failed: " + e.getMessage());

        return Map.of(
                "anomaly", false,
                "message", "Metric saved successfully, but AI analysis is temporarily unavailable"
        );
    }

    Boolean anomaly = (Boolean) aiResult.get("anomaly");

    if (Boolean.TRUE.equals(anomaly)) {

        String analysis =
                "Anomaly detected. GenAI root-cause analysis is currently unavailable.";

        try {
            Map rootCauseResult =
                    aiAnalysisService.analyzeRootCause(savedMetric);

            Object rootCause = rootCauseResult.get("analysis");

            if (rootCause != null) {
                analysis = rootCause.toString();
            }

        } catch (Exception e) {
            System.err.println(
                    "GenAI root-cause analysis failed: " + e.getMessage()
            );
        }

        try {
            Incident incident = new Incident();

            incident.setTitle("Anomalous behavior detected");
            incident.setStatus(IncidentStatus.OPEN);
            incident.setRootCause(analysis);

            boolean critical =
                    savedMetric.getLatency() >= 5000 ||
                    savedMetric.getErrorRate() >= 30 ||
                    savedMetric.getCpuUsage() >= 95 ||
                    savedMetric.getMemoryUsage() >= 95;

            incident.setSeverity(
                    critical
                            ? IncidentSeverity.CRITICAL
                            : IncidentSeverity.HIGH
            );

            double confidenceScore = 0.0;

            if (savedMetric.getLatency() >= 3000) {
                confidenceScore += 0.25;
            }

            if (savedMetric.getErrorRate() >= 20) {
                confidenceScore += 0.25;
            }

            if (savedMetric.getCpuUsage() >= 90) {
                confidenceScore += 0.25;
            }

            if (savedMetric.getMemoryUsage() >= 90) {
                confidenceScore += 0.25;
            }

            incident.setConfidenceScore(confidenceScore);

            incidentService.createIncident(serviceId, incident);

        } catch (Exception e) {
            System.err.println(
                    "Incident creation failed for service "
                            + serviceId + ": " + e.getMessage()
            );
        }
    }

    return aiResult;
}
}