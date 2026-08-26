package com.aegis.backend.service;

import com.aegis.backend.entity.Incident;
import com.aegis.backend.entity.MonitoredService;
import com.aegis.backend.repository.IncidentRepository;
import com.aegis.backend.repository.MonitoredServiceRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import com.aegis.backend.entity.IncidentStatus;

import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final MonitoredServiceRepository monitoredServiceRepository;

    public IncidentService(
            IncidentRepository incidentRepository,
            MonitoredServiceRepository monitoredServiceRepository
    ) {
        this.incidentRepository = incidentRepository;
        this.monitoredServiceRepository = monitoredServiceRepository;
    }

    public Incident createIncident(Long serviceId, Incident incident) {

        MonitoredService service = monitoredServiceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        incident.setAffectedService(service);

        return incidentRepository.save(incident);
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
    }

    public Incident resolveIncident(Long id) {

        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        incident.setStatus(IncidentStatus.RESOLVED);
        incident.setResolvedAt(LocalDateTime.now());

        return incidentRepository.save(incident);
    }
}