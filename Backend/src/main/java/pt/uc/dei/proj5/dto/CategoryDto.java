package pt.uc.dei.proj5.dto;

import java.io.Serializable;
import java.util.Set;

public class CategoryDto implements Serializable {
    private String nome;
    private String nameEng;
    private Set<ProductDto> products;

    //Constructors
    public CategoryDto() {}

    public CategoryDto(String nome, String nameEng, Set<ProductDto> products) {
        this.nome = nome;
        this.nameEng = nameEng;
        this.products = products;
    }

    //Setter and Getters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNameEng() {
        return nameEng;
    }
    public void setNameEng(String nameEng) {
        this.nameEng = nameEng;
    }

    public boolean hasValidValues() {
        return this.nome != null && !this.nome.isEmpty() && this.nameEng != null && !this.nameEng.isEmpty();
    }

    public Set<ProductDto> getProducts() {
        return products;
    }

    public void setProducts(Set<ProductDto> products) {
        this.products = products;
    }

}
