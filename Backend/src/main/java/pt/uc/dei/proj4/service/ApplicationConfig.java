package pt.uc.dei.proj4.service;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import pt.uc.dei.proj4.beans.ApplicationBean;

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
        return resources;
    }
}
