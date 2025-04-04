package pt.uc.dei.proj5.beans;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import pt.uc.dei.proj5.dao.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;

@Stateless
public class ApplicationBean implements Serializable {
    private static final Logger logger = LogManager.getLogger(ApplicationBean.class);
    UserDao userDao;
    ProductDao productDao;
    CategoryDao categoryDao;
    MessageDao messageDao;
    TokenDao tokenDao;


    @Inject
    public ApplicationBean(final UserDao userDao, final ProductDao productDao, final CategoryDao categoryDao, final MessageDao messageDao, final TokenDao tokenDao) {
        this.userDao = userDao;
        this.productDao = productDao;
        this.categoryDao = categoryDao;
        this.messageDao = messageDao;
        this.tokenDao = tokenDao;
    }

    public ApplicationBean() {
    }

}
