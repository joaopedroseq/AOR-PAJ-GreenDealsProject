package pt.uc.dei.proj5.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class ProductStatisticsDto {
    private int totalProducts;
    private Map<ProductStateId, Integer> productsByState;
    private List<Map<String, Object>> productsByCategory;
    public double avgProductsPerUser;
    public double avgPriceOfProducts;
    public List<Map<String, Object>> avgPricePerCategory;
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

    public List<Map<String, Object>> getProductsByCategory() {
        return productsByCategory;
    }

    public void setProductsByCategory(List<Map<String, Object>> productsByCategory) {
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

    public List<Map<String, Object>> getAvgPricePerCategory() {
        return avgPricePerCategory;
    }

    public void setAvgPricePerCategory(List<Map<String, Object>> avgPricePerCategory) {
        this.avgPricePerCategory = avgPricePerCategory;
    }

    public Map<String, Integer> getTopLocations() {
        return topLocations;
    }

    public void setTopLocations(Map<String, Integer> topLocations) {
        this.topLocations = topLocations;
    }
}