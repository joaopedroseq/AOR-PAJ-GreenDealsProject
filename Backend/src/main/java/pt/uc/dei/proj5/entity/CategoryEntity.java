package pt.uc.dei.proj5.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Set;



//get all categorie's names
@NamedQuery(name = "Category.getAllCategoriesNames", query = "SELECT nome FROM CategoryEntity c WHERE c.nameEng != :empty ORDER BY nome")

// to get a category by name
@NamedQuery(name = "Category.findCategoryByName", query = "SELECT c FROM CategoryEntity c WHERE c.nome = :nome")

// to delete a category by name
@NamedQuery(name = "Category.deleteCategory", query = "DELETE FROM CategoryEntity c WHERE c.nome = :nome")

@Entity
@Table(name="category", indexes = {
        @Index(name = "idx_category_nome", columnList = "nome")
})
public class CategoryEntity implements Serializable {
    @Id
    @Column(name="nome", nullable=false, unique = true, updatable = false)
    private String nome;

    @Column(name="nameEng", nullable=false, unique = true, updatable = false)
    private String nameEng;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private Set<ProductEntity> products;

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

    public String getNameEng() {
        return nameEng;
    }

    public void setNameEng(String nameEng) {
        this.nameEng = nameEng;
    }

    public Set<ProductEntity> getProduct() {
        return products;
    }

    public void setProduct(Set<ProductEntity> products) {
        this.products = products;
    }
}
