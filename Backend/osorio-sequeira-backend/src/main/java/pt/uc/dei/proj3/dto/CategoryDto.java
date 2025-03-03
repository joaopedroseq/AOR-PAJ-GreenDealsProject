package pt.uc.dei.proj3.dto;

import java.io.Serializable;

public class CategoryDto implements Serializable {
    private String name;

    //Constructors
    public CategoryDto() {}

    public CategoryDto(String name) {
        this.name = name;
    }

    //Setter and Getters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isValid() {
        return this.name != null && !this.name.isEmpty();
    }

}
