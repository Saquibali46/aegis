package com.aegis.backend.repository;

import com.aegis.backend.entity.ServiceMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceMetricRepository extends JpaRepository<ServiceMetric, Long> {

    List<ServiceMetric> findByServiceIdOrderByRecordedAtDesc(Long serviceId);
}