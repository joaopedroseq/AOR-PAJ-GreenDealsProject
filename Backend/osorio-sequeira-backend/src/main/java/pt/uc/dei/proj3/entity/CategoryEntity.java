package pt.uc.dei.proj3.entity;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Set;

//to get all categories
@NamedQuery(name = "Category.getAllCategories", query = "SELECT c FROM CategoryEntity c")
@Entity
@Table(name="category")

@NamedQuery(name = "Category.findCategoryByName", query = "SELECT c FROM CategoryEntity c WHERE c.nome = :nome")


public class CategoryEntity implements Serializable {
    @Id
    @Column(name="nome", nullable=false, unique = true, updatable = false)
    private String nome;

    @OneToMany(mappedBy = "category")
    private Set<ProductEntity> product;

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

    public Set<ProductEntity> getProduct() {
        return product;
    }

    public void setProduct(Set<ProductEntity> product) {
        this.product = product;
    }
}
