package pt.uc.dei.proj5.dao;

import jakarta.ejb.Stateless;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dto.MessageDto;
import pt.uc.dei.proj5.dto.MessageNotificationDto;
import pt.uc.dei.proj5.dto.Order;
import pt.uc.dei.proj5.dto.UserDto;
import pt.uc.dei.proj5.entity.CategoryEntity;
import pt.uc.dei.proj5.entity.MessageEntity;
import pt.uc.dei.proj5.entity.ProductEntity;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Stateless
public class MessageDao extends AbstractDao<MessageEntity> {
    private static final Logger logger = LogManager.getLogger(MessageDao.class);
    private static final long serialVersionUID = 1L;

    public MessageDao() {
        super(MessageEntity.class);
    }

    public Set<MessageDto> getConversation(UserDto recipient, UserDto sender) {
        Set<MessageDto> messages = new HashSet<>();
        return null;

    }

    public List<MessageNotificationDto> getMessageNotifications(String recipientUsername) {
        try {
            List<MessageNotificationDto> results = em.createNamedQuery("MessageEntity.getMessageNotifications", MessageNotificationDto.class).setParameter("recipient_username", recipientUsername).getResultList();
            return results;
        }
        catch (Exception e) {
            logger.error(e);
            return null;
        }
    }


}
