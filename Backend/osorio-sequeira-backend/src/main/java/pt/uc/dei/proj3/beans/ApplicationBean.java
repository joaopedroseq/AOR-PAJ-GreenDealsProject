package pt.uc.dei.proj3.beans;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import pt.uc.dei.proj3.dao.CategoryDao;
import pt.uc.dei.proj3.dao.ProductDao;
import pt.uc.dei.proj3.dao.UserDao;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;

@Stateless
public class ApplicationBean implements Serializable {
    private static final Logger logger = LogManager.getLogger(ApplicationBean.class);
    UserDao userDao;
    ProductDao productDao;
    CategoryDao categoryDao;

    @Inject
    public ApplicationBean(final UserDao userDao, final ProductDao productDao, final CategoryDao categoryDao) {
        this.userDao = userDao;
        this.productDao = productDao;
        this.categoryDao = categoryDao;
    }

    public ApplicationBean() {
    }

}
