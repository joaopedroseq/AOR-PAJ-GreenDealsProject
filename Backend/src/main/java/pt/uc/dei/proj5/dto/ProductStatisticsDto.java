package pt.uc.dei.proj5.dto;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class ProductStatisticsDto {
    private int totalProducts;
    private Map<ProductStateId, Integer> productsByState;
    private Map<CategoryDto, Integer> productsByCategory;
    public double avgProductsPerUser;
    public double avgPriceOfProducts;
    public Map<CategoryDto, Double> avgPricePerCategory;
    public Map<String, Integer> topLocations;

    public ProductStatisticsDto() {
    }

    public int getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(int totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Map<ProductStateId, Integer> getProductsByState() {
        return productsByState;
    }

    public void setProductsByState(Map<ProductStateId, Integer> productsByState) {
        this.productsByState = productsByState;
    }

    public Map<CategoryDto, Integer> getProductsByCategory() {
        return productsByCategory;
    }

    public void setProductsByCategory(Map<CategoryDto, Integer> productsByCategory) {
        this.productsByCategory = productsByCategory;
    }

    public double getAvgProductsPerUser() {
        return avgProductsPerUser;
    }

    public void setAvgProductsPerUser(double avgProductsPerUser) {
        this.avgProductsPerUser = avgProductsPerUser;
    }

    public double getAvgPriceOfProducts() {
        return avgPriceOfProducts;
    }

    public void setAvgPriceOfProducts(double avgPriceOfProducts) {
        this.avgPriceOfProducts = avgPriceOfProducts;
    }

    public Map<CategoryDto, Double> getAvgPricePerCategory() {
        return avgPricePerCategory;
    }

    public void setAvgPricePerCategory(Map<CategoryDto, Double> avgPricePerCategory) {
        this.avgPricePerCategory = avgPricePerCategory;
    }

    public Map<String, Integer> getTopLocations() {
        return topLocations;
    }

    public void setTopLocations(Map<String, Integer> topLocations) {
        this.topLocations = topLocations;
    }
}