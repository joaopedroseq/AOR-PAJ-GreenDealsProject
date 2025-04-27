package pt.uc.dei.proj5.beans;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dao.CategoryDao;
import pt.uc.dei.proj5.dao.ProductDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.*;
import pt.uc.dei.proj5.entity.ProductEntity;
import pt.uc.dei.proj5.entity.UserEntity;

import java.lang.reflect.Parameter;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Stateless
public class StatisticsBean {
    private static final Logger logger = LogManager.getLogger(StatisticsBean.class);

    @Inject
    ProductDao productDao;

    @Inject
    UserDao userDao;

    @Inject
    CategoryBean categoryBean;

    //For Product Statistics
    public ProductStatisticsDto getProductStatistics() {
        ProductStatisticsDto productStatistics = new ProductStatisticsDto();
        List<ProductEntity> products = productDao.getFilteredProducts(null,
                null,
                null,
                ProductStateId.DRAFT,
                null,
                null,
                false,
                ProductParameter.DATE,
                Order.asc);
        productStatistics.setTotalProducts(products.size());
        productStatistics.setProductsByState(getTotalProductByState(products));
        productStatistics.setProductsByCategory(getTotalProductByCategory(products));
        productStatistics.setAvgProductsPerUser(products.size() / userDao.getNumberOfUsers());
        productStatistics.setAvgPriceOfProducts(getAvgPriceOfProducts(products));
        productStatistics.setAvgPricePerCategory(getAvgPricePerCategory(products));
        productStatistics.setTopLocations(getTopLocations(products));
        return productStatistics;
    }

    private Map<ProductStateId, Integer> getTotalProductByState(List<ProductEntity> products) {
        Map<ProductStateId, Integer> productsByState = new LinkedHashMap<>();
        for (ProductEntity productEntity : products) {
            ProductStateId state = productEntity.getState();
            productsByState.put(state, productsByState.getOrDefault(state, 0) + 1);
        }
        return productsByState;
    }

    private List<Map<String, Object>> getTotalProductByCategory(List<ProductEntity> products) {
        Map<CategoryDto, Integer> productCountMap = new LinkedHashMap<>();
        for (ProductEntity productEntity : products) {
            CategoryDto category = categoryBean.lazyConvertCategoryEntityToCategoryDto(productEntity.getCategory());
            productCountMap.put(category, productCountMap.getOrDefault(category, 0) + 1);
        }
        List<Map<String, Object>> formattedList = new ArrayList<>();
        for (CategoryDto category : productCountMap.keySet()) {
            Map<String, Object> categoryData = new LinkedHashMap<>();
            categoryData.put("nome", category.getNome()); // Portuguese name
            categoryData.put("nameEng", category.getNameEng()); // English name
            categoryData.put("productCount", productCountMap.get(category)); // Product count
            formattedList.add(categoryData);
        }
        return formattedList;
    }

    private double getAvgPriceOfProducts(List<ProductEntity> products) {
        double avgPrice = 0;
        if(products.size() > 0) {
            for (ProductEntity productEntity : products) {
                avgPrice += productEntity.getPrice();
            }
            return avgPrice / products.size();
        }
        else {
            return 0.0;
        }
    }

    private List<Map<String, Object>> getAvgPricePerCategory(List<ProductEntity> products) {
        Map<CategoryDto, Double> totalPricesByCategory = new LinkedHashMap<>();
        Map<CategoryDto, Integer> countByCategory = new HashMap<>();

        for (ProductEntity productEntity : products) {
            CategoryDto category = categoryBean.lazyConvertCategoryEntityToCategoryDto(productEntity.getCategory());
            double price = productEntity.getPrice();
            totalPricesByCategory.put(category, totalPricesByCategory.getOrDefault(category, 0.0) + price);
            countByCategory.put(category, countByCategory.getOrDefault(category, 0) + 1);
        }
        List<Map<String, Object>> formattedList = new ArrayList<>();
        for (CategoryDto category : totalPricesByCategory.keySet()) {
            Map<String, Object> categoryData = new LinkedHashMap<>();
            categoryData.put("nome", category.getNome()); // Portuguese name
            categoryData.put("nameEng", category.getNameEng()); // English name
            categoryData.put("avgPrice", countByCategory.get(category) != 0 ?
                    totalPricesByCategory.get(category) / countByCategory.get(category)
                    : 0.0
            );
            formattedList.add(categoryData);
        }
        return formattedList;
    }

    private Map<String, Integer> getTopLocations(List<ProductEntity> products) {
        Map<String, Integer> topLocations = new LinkedHashMap<>();
        for (ProductEntity productEntity : products) {
            topLocations.put(productEntity.getLocation(), topLocations.getOrDefault(productEntity.getLocation(), 0) + 1);
        }
        return topLocations.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue(Comparator.reverseOrder()))
                .limit(5)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
    }

    //For User Statistics
    public UserStatisticsDto getUserStatistics() {
        UserStatisticsDto userStatistics = new UserStatisticsDto();
        List<UserEntity> users = userDao.getFilteredUsers(null,
        null,
        null,
        null,
        null,
        null,
        UserParameter.USERNAME,
        Order.asc);
        userStatistics.setTotalUsers(users.size());
        userStatistics.setUsersByState(getUsersByState(users));
        userStatistics.setNewUsersByPeriod(getNewUsersByPeriod(users));
        double avgTimeActivate = calculateAvgTimeToFirstActivate(users);
        userStatistics.setAvgTimeToActivate(avgTimeActivate);
        double avgTimeToFirstPublish = calculateAvgTimeToFirstPublish(users);
        userStatistics.setAvgTimeToFirstPublish(avgTimeToFirstPublish);
        return userStatistics;
    }

    private Map<UserAccountState, Integer> getUsersByState(List<UserEntity> users) {
        Map<UserAccountState, Integer> usersByState = new LinkedHashMap<>();
        for (UserEntity userEntity : users) {
            UserAccountState userAccountState = userEntity.getState();
            usersByState.put(userAccountState, usersByState.getOrDefault(userAccountState, 0) + 1);
        }
        return usersByState;
    }

    private Map<String, Integer> getNewUsersByPeriod(List<UserEntity> users) {
        Map<String, Integer> newUsersByPeriod = new LinkedHashMap<>();
        int usersOfTheDay = 0;
        int usersOfTheWeek = 0;
        int usersOfTheMonth = 0;
        LocalDateTime now = LocalDateTime.now();
        for (UserEntity user : users) {
            LocalDateTime registrationDate = user.getRegistrationDate(); // Assuming UserEntity has getRegistrationDate()
            if (registrationDate.isAfter(now.minusDays(1))) {
                usersOfTheDay++;
            }
            if (registrationDate.isAfter(now.minusWeeks(1))) {
                usersOfTheWeek++;
            }
            if (registrationDate.isAfter(now.minusMonths(1))) {
                usersOfTheMonth++;
            }
        }
        newUsersByPeriod.put("day", usersOfTheDay);
        newUsersByPeriod.put("week", usersOfTheWeek);
        newUsersByPeriod.put("month", usersOfTheMonth);
        return newUsersByPeriod;
    }

    private double calculateAvgTimeToFirstActivate(List<UserEntity> users) {
        double totalTimeToFirstActivate = 0;
        int totalActivatedUsers = 0;
        for (UserEntity user : users) {
            if (user.getState() == UserAccountState.ACTIVE && user.getActivationDate() != null) {
                System.out.println(user.getUsername());
                totalActivatedUsers++;
                System.out.println("Registration: " + user.getRegistrationDate());
                System.out.println("Activation: " + user.getActivationDate());
                Duration duration = Duration.between(user.getRegistrationDate(), user.getActivationDate());
                System.out.println("Duration: " + duration.toMinutes() + " minutes");
                totalTimeToFirstActivate += duration.toMinutes();
                System.out.println(totalTimeToFirstActivate);
            }
        }
        return (totalActivatedUsers > 0) ? totalTimeToFirstActivate / totalActivatedUsers : 0.0;
    }

    private double calculateAvgTimeToFirstPublish(List<UserEntity> users) {
        int totalUsers = users.size();
        double totalTimeToFirstPublish = 0;
        for (UserEntity user : users) {
            LocalDateTime registrationDate = user.getRegistrationDate();
            if(user.getProducts().size() != 0) {
                Set<ProductEntity> products = user.getProducts();
                LocalDateTime earliestPublish = user.getProducts().stream().findFirst().get().getDate();
                for (ProductEntity product : products) {
                    if(product.getDate().isBefore(earliestPublish)) {
                        earliestPublish = product.getDate();
                        System.out.println("Earliest publish: " + earliestPublish);
                    }
                }
                Duration duration = Duration.between(user.getRegistrationDate(), earliestPublish);
                totalTimeToFirstPublish += duration.toMinutes();
                System.out.println(totalTimeToFirstPublish);
            }
        }
        return (totalUsers > 0) ? totalTimeToFirstPublish / totalUsers : 0.0;
    }
}