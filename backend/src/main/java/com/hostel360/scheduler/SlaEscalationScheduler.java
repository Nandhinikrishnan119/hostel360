package com.hostel360.scheduler;

import com.hostel360.service.EscalationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SlaEscalationScheduler {

    private final EscalationService escalationService;

    // Runs every 60 seconds to detect breached SLAs in real-time
    @Scheduled(fixedRate = 60000)
    public void runSlaOverdueCheck() {
        try {
            escalationService.processOverdueComplaints();
        } catch (Exception e) {
            log.error("Error during SLA escalation scheduler execution", e);
        }
    }
}
