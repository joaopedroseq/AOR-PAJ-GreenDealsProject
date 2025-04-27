package pt.uc.dei.proj5.beans;

import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dao.CategoryDao;
import pt.uc.dei.proj5.dao.ProductDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.CategoryDto;
import pt.uc.dei.proj5.dto.ProductDto;
import pt.uc.dei.proj5.dto.ProductStateId;
import pt.uc.dei.proj5.dto.ProductStatisticsDto;
import pt.uc.dei.proj5.entity.ProductEntity;

import java.util.*;
import java.util.stream.Collectors;

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
        List<ProductEntity> products = productDao.getFilteredProducts(null, null, null, ProductStateId.DRAFT, null, null, null, null, null);
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

    private Map<CategoryDto, Integer> getTotalProductByCategory(List<ProductEntity> products) {
        Map<CategoryDto, Integer> productsByCategory = new LinkedHashMap<>();
        for (ProductEntity productEntity : products) {
            CategoryDto category = categoryBean.lazyConvertCategoryEntityToCategoryDto(productEntity.getCategory()); // Assuming ProductEntity has a getCategory() method
            productsByCategory.put(category, productsByCategory.getOrDefault(category, 0) + 1);
        }
        return productsByCategory;
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

    private Map<CategoryDto, Double> getAvgPricePerCategory(List<ProductEntity> products) {
        Map<CategoryDto, Double> totalPricesByCategory = new LinkedHashMap<>();
        Map<CategoryDto, Integer> countByCategory = new HashMap<>();
        for (ProductEntity productEntity : products) {
            CategoryDto category = categoryBean.lazyConvertCategoryEntityToCategoryDto(productEntity.getCategory());;
            double price = productEntity.getPrice(); // Assuming `ProductEntity` has `getPrice()`
            // Accumulate total price for each category
            totalPricesByCategory.put(category, totalPricesByCategory.getOrDefault(category, 0.0) + price);
            // Keep track of product count for each category
            countByCategory.put(category, countByCategory.getOrDefault(category, 0) + 1);
        }
        // Compute average price for each category
        Map<CategoryDto, Double> avgPriceByCategory = new LinkedHashMap<>();
        for (CategoryDto category : totalPricesByCategory.keySet()) {
            if(countByCategory.get(category) != 0) {
                avgPriceByCategory.put(category, totalPricesByCategory.get(category) / countByCategory.get(category));
            }
            else {
                avgPriceByCategory.put(category, 0.0);
            }
        }
        return avgPriceByCategory;
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













}
