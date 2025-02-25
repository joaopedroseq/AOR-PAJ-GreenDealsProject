package pt.uc.dei.proj3.entity;

import jakarta.persistence.*;

@Entity
@Table(name="category")
public class CategoryEntity {

    @Id
    @Column(name="nome", nullable=false, unique = true, updatable = false)
    private String nome;

    @OneToMany(mappedBy = "category")
    private ProductEntity product;

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
