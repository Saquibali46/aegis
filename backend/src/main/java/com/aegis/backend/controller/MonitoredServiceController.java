package com.aegis.backend.controller;

import com.aegis.backend.entity.MonitoredService;
import com.aegis.backend.service.MonitoredServiceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class MonitoredServiceController {

    private final MonitoredServiceService monitoredServiceService;

    public MonitoredServiceController(MonitoredServiceService monitoredServiceService) {
        this.monitoredServiceService = monitoredServiceService;
    }

    @PostMapping
    public MonitoredService createService(@RequestBody MonitoredService monitoredService) {
        return monitoredServiceService.createService(monitoredService);
    }

    @GetMapping
    public List<MonitoredService> getAllServices() {
        return monitoredServiceService.getAllServices();
    }
    @GetMapping("/{id}")
    public MonitoredService getServiceById(@PathVariable Long id) {
        return monitoredServiceService.getServiceById(id);
    }
    @PatchMapping("/{id}/status")
    public MonitoredService updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return monitoredServiceService.updateStatus(id, status);
    }
    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable Long id) {
        monitoredServiceService.deleteService(id);
    }
}