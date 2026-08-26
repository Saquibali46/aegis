package com.aegis.backend.service;

import com.aegis.backend.entity.MonitoredService;
import com.aegis.backend.repository.MonitoredServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MonitoredServiceService {

    private final MonitoredServiceRepository repository;

    public MonitoredServiceService(MonitoredServiceRepository repository) {
        this.repository = repository;
    }

    public MonitoredService createService(MonitoredService monitoredService) {
        return repository.save(monitoredService);
    }

    public List<MonitoredService> getAllServices() {
        return repository.findAll();
    }
    public MonitoredService getServiceById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }
    public MonitoredService updateStatus(Long id, String status) {

        MonitoredService service = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setStatus(status);

        return repository.save(service);
    }
    public void deleteService(Long id) {
        MonitoredService service = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        repository.delete(service);
    }
}