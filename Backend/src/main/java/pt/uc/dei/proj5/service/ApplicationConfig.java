package pt.uc.dei.proj5.service;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import pt.uc.dei.proj5.beans.ApplicationBean;
import pt.uc.dei.proj5.beans.TokenBean;

import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/rest")
public class ApplicationConfig extends Application {
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new HashSet<>();
        resources.add(CorsFilter.class);
        resources.add(ApplicationBean.class);
        resources.add(UserService.class);
        resources.add(ProductService.class);
        resources.add(CategoryService.class);
        resources.add(AuthenticationService.class);
        resources.add(ConfigurationService.class);
        resources.add(MessageService.class);
        resources.add(NotificationService.class);
        return resources;
    }
}
