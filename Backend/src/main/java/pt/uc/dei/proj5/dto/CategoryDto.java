package pt.uc.dei.proj5.dto;

import java.io.Serializable;
import java.util.Objects;
import java.util.Set;

public class CategoryDto implements Serializable {
    private String nome;
    private String nameEng;
    private int products;

    //Constructors
    public CategoryDto() {}

    public CategoryDto(String nome, String nameEng) {
        this.nome = nome;
        this.nameEng = nameEng;
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

    public int getProducts() {
        return products;
    }

    public void setProducts(int products) {
        this.products = products;
    }

    public boolean hasValidValues() {
        return this.nome != null && !this.nome.isEmpty() && this.nameEng != null && !this.nameEng.isEmpty();
    }

    @Override
    public int hashCode() {
        return Objects.hash(nome, nameEng);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        CategoryDto other = (CategoryDto) obj;
        return Objects.equals(this.nome, other.nome) && Objects.equals(this.nameEng, other.nameEng);
    }

}
