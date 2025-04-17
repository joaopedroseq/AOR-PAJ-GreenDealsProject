package pt.uc.dei.proj5.beans;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dao.MessageDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.MessageDto;
import pt.uc.dei.proj5.dto.MessageNotificationDto;
import pt.uc.dei.proj5.dto.UserDto;
import pt.uc.dei.proj5.entity.MessageEntity;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

@Stateless
public class MessageBean implements Serializable {
    private static final Logger logger = LogManager.getLogger(UserBean.class);

    @Inject
    UserDao userDao;

    @EJB
    MessageDao messageDao;

    public MessageBean() {
    }

    public Set<MessageDto> getMessagesForUser(UserDto userDto) {
        return null;
    }

    public List<MessageNotificationDto> getMessagesNotificationsForUser(String recipientUsername) {
        try{
            return messageDao.getMessageNotifications(recipientUsername);
        }
        catch (Exception e) {
            logger.error(e);
            return null;
        }
    }

    public boolean newMessage(MessageDto messageDto) {
        try {
            MessageEntity newMessageEntity = convertMessageDtoToMessageEntity(messageDto);
            messageDao.persist(newMessageEntity);
            return true;
        }
        catch(Exception e) {
            logger.error(e);
            return false;
        }
    }

    private MessageEntity convertMessageDtoToMessageEntity(MessageDto messageDto) {
        MessageEntity messageEntity = new MessageEntity();
        messageEntity.setMessageId(messageDto.getMessageId());
        messageEntity.setMessage(messageDto.getMessage());
        messageEntity.setRead(messageDto.getRead());
        messageEntity.setDeleted(messageDto.getDeleted());
        messageEntity.setTimestamp(messageDto.getTimestamp());
        messageEntity.setDateEdited(messageEntity.getDateEdited());
        try {
            messageEntity.setSender(userDao.findUserByUsername(messageDto.getSender()));
        }
        catch(Exception e) {
            return null;
        }
        try {
            messageEntity.setRecipient(userDao.findUserByUsername(messageDto.getRecipient()));
        }
        catch(Exception e) {
            return null;
        }
        return messageEntity;
    }
}

