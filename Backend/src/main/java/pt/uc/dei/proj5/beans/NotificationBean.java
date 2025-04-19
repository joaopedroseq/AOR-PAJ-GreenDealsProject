package pt.uc.dei.proj5.beans;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dao.NotificationDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.NotificationDto;
import pt.uc.dei.proj5.dto.NotificationType;
import pt.uc.dei.proj5.dto.ProductDto;
import pt.uc.dei.proj5.dto.UserDto;
import pt.uc.dei.proj5.entity.NotificationEntity;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Stateless
public class NotificationBean {
    private static final Logger logger = LogManager.getLogger(NotificationBean.class);

    @Inject
    NotificationDao notificationDao;

    @Inject
    UserDao userDao;

    public NotificationBean() {
    }

    public List<NotificationDto> getNotifications(UserDto user) {
        try {
            List<NotificationEntity> notificationEntities = notificationDao.getNotifications(user.getUsername());
            List<NotificationDto> notificationDtos = notificationEntities.stream()
                    .map(this::convertNotificationEntityToNotificationDto)
                    .collect(Collectors.toList());
            return notificationDtos;
        } catch (Exception e) {
            logger.error("Failed to get notifications from user " + user.getUsername());
            return Collections.emptyList();
        }
    }

    public boolean readNotification(NotificationDto notificationDto, UserDto recipient) {
        try {
            return notificationDao.readNotification(notificationDto.getId(), recipient.getUsername());
        } catch (Exception e) {
            logger.error("Error reading notification", e);
            return false;
        }
    }

    public boolean newProductNotification(NotificationType type, String senderUsername, String recipientUsername, ProductDto product) {
        try {
            NotificationEntity notificationEntity = new NotificationEntity();
            notificationEntity.setType(type);
            notificationEntity.setRecipient(userDao.findUserByUsername(senderUsername));
            notificationEntity.setSender(userDao.findUserByUsername(recipientUsername));
            notificationEntity.setRead(false);
            notificationEntity.setTimestamp(LocalDateTime.now());
            String notificationContent = switch (type) {
                case MESSAGE -> "new message";
                case PRODUCT_BOUGHT -> product.getId() + "has been bought";
                case PRODUCT_ALTERED -> product.getId() + "has been altered";
            };
            notificationEntity.setContent(notificationContent);
            notificationDao.persist(notificationEntity);
            return true;
        } catch (Exception e) {
            logger.error("Error setting new notification", e);
            return false;
        }
    }

    public boolean newMessageNotification(String senderUsername, String recipientUsername) {
        try {
            if (hasRecipientBeenNotified(senderUsername, recipientUsername)) {
                return notificationDao.updateMessageNotification(senderUsername, recipientUsername);
            } else {
                NotificationEntity notificationEntity = new NotificationEntity();
                notificationEntity.setType(NotificationType.MESSAGE);
                notificationEntity.setRecipient(userDao.findUserByUsername(recipientUsername));
                notificationEntity.setSender(userDao.findUserByUsername(senderUsername));
                notificationEntity.setRead(false);
                notificationEntity.setTimestamp(LocalDateTime.now());
                notificationEntity.setMessageCount(1);
                notificationEntity.setContent("new message");
                notificationDao.persist(notificationEntity);
                return true;
            }
        } catch (Exception e) {
            logger.error("Error setting new notification", e);
            return false;
        }
    }


    public boolean checkIfNotificationExists(NotificationDto notificationDto, UserDto recipient) {
        return notificationDao.isNotificationIdValid(notificationDto.getId(), recipient.getUsername());
    }

    private boolean hasRecipientBeenNotified(String senderUsername, String recipientUsername) {
        return notificationDao.hasRecipientBeenNotified(senderUsername, recipientUsername);
    }

    private NotificationDto convertNotificationEntityToNotificationDto(NotificationEntity notificationEntity) {
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setId(notificationEntity.getId());
        notificationDto.setType(notificationEntity.getType());
        notificationDto.setContent(notificationEntity.getContent());
        notificationDto.setRead(notificationEntity.isRead());
        notificationDto.setTimestamp(notificationEntity.getTimestamp());
        notificationDto.setRecipientUsername(notificationEntity.getRecipient().getUsername());
        notificationDto.setSenderUsername(notificationEntity.getSender().getUsername());
        notificationDto.setSenderProfileUrl(notificationEntity.getSender().getUrl());
        return notificationDto;
    }
}
