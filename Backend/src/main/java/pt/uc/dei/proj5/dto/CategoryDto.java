package pt.uc.dei.proj5.dto;

import java.io.Serializable;
import java.util.Set;

public class CategoryDto implements Serializable {
    private String nome;
    private String nameEng;

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

    public boolean hasValidValues() {
        return this.nome != null && !this.nome.isEmpty() && this.nameEng != null && !this.nameEng.isEmpty();
    }


}
