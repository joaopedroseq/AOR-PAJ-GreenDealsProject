package pt.uc.dei.proj3.dto;

import java.io.Serializable;
import java.util.Set;

public class CategoryDto implements Serializable {
    private String name;
    private Set<ProductDto> products;

    //Constructors
    public CategoryDto() {}

    public CategoryDto(String nome, Set<ProductDto> products) {
        this.name = nome;
        this.products = products;
    }

    //Setter and Getters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean hasValidValues() {
        return this.name != null && !this.name.isEmpty();
    }

    public Set<ProductDto> getProducts() {
        return products;
    }

    public void setProducts(Set<ProductDto> products) {
        this.products = products;
    }

}
