package pt.uc.dei.proj5.dao;

import jakarta.ejb.Stateless;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.entity.CategoryEntity;
import pt.uc.dei.proj5.entity.MessageEntity;

@Stateless
public class MessageDao extends AbstractDao<MessageEntity> {
    private static final Logger logger = LogManager.getLogger(MessageDao.class);
    private static final long serialVersionUID = 1L;

    public MessageDao() {
        super(MessageEntity.class);
    }


}
