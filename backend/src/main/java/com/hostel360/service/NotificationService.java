package com.hostel360.service;

import com.hostel360.entity.Notification;
import com.hostel360.entity.User;
import com.hostel360.entity.enums.NotificationType;
import com.hostel360.exception.ResourceNotFoundException;
import com.hostel360.repository.NotificationRepository;
import com.hostel360.repository.UserRepository;
import com.hostel360.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Async
    @Transactional
    public void sendNotification(Long recipientId, String title, String message,
                                 NotificationType type, Long referenceId, String actionUrl) {
        try {
            User recipient = userRepository.findById(recipientId).orElse(null);
            if (recipient != null) {
                Notification notification = Notification.builder()
                        .recipient(recipient)
                        .title(title)
                        .message(message)
                        .type(type)
                        .referenceId(referenceId)
                        .actionUrl(actionUrl)
                        .isRead(false)
                        .build();
                notificationRepository.save(notification);
            }
        } catch (Exception e) {
            log.error("Failed to send notification to user {}", recipientId, e);
        }
    }

    @Transactional(readOnly = true)
    public List<Notification> getMyNotifications() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) return List.of();
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public Long getUnreadCount() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) return 0L;
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Long userId = SecurityUtils.getCurrentUserId();
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        if (notif.getRecipient().getId().equals(userId)) {
            notif.setIsRead(true);
            notificationRepository.save(notif);
        }
    }

    @Transactional
    public void markAllAsRead() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId != null) {
            List<Notification> unread = notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId);
            unread.forEach(n -> n.setIsRead(true));
            notificationRepository.saveAll(unread);
        }
    }
}
