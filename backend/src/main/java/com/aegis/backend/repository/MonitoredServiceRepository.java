package com.aegis.backend.repository;

import com.aegis.backend.entity.MonitoredService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonitoredServiceRepository
        extends JpaRepository<MonitoredService, Long> {
}