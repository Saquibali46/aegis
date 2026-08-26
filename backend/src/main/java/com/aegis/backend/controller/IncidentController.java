package com.aegis.backend.controller;

import com.aegis.backend.entity.Incident;
import com.aegis.backend.service.IncidentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping("/service/{serviceId}")
    public Incident createIncident(
            @PathVariable Long serviceId,
            @RequestBody Incident incident
    ) {
        return incidentService.createIncident(serviceId, incident);
    }

    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentService.getAllIncidents();
    }

    @GetMapping("/{id}")
    public Incident getIncidentById(@PathVariable Long id) {
        return incidentService.getIncidentById(id);
    }

    @PutMapping("/{id}/resolve")
    public Incident resolveIncident(@PathVariable Long id) {
        return incidentService.resolveIncident(id);
    }
}