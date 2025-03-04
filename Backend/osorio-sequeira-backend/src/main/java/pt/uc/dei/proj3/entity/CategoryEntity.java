package pt.uc.dei.proj3.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="category")

//to get all categories
@NamedQuery(name = "Category.getAllCategories", query = "SELECT c FROM CategoryEntity c WHERE c.nome != :empty")

// to get a category by name
@NamedQuery(name = "Category.findCategoryByName", query = "SELECT c FROM CategoryEntity c WHERE c.nome = :nome")

// to delete a category by name
@NamedQuery(name = "Category.deleteCategory", query = "DELETE FROM CategoryEntity c WHERE c.nome = :nome")

public class CategoryEntity implements Serializable {
    @Id
    @Column(name="nome", nullable=false, unique = true, updatable = false)
    private String nome;

    @OneToMany(mappedBy = "category")
    private List<ProductEntity> product;

    //Constructors
    public CategoryEntity() {
    }

    //Getters and Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
