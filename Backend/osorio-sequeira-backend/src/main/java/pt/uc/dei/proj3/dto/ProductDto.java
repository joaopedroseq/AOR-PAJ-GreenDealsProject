package pt.uc.dei.proj3.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

import java.io.Serializable;
import java.time.LocalDateTime;

@XmlRootElement
public class ProductDto implements Serializable{
    private Integer id;
    private String seller;
    private String name;
    private String description;
    private double price;
    private String category;
    private String location;
    private String urlImage;
    private StateId state;
    private LocalDateTime date;

    public ProductDto() {
    }

    //CONSTRUTOR QUANDO É ADICIONADO PRODUTO
    public ProductDto(String seller, String name, String description, double price, String category, String location, String urlImage) {
        this.seller = seller;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.location = location;
        this.urlImage = urlImage;
    }

    //CONSTRUTOR QUANDO É BUSCADO UM PRODUTO
    public ProductDto(String seller, String name, String description, double price, String category, String location, String urlImage, StateId state, LocalDateTime date, int id) {
        this.seller = seller;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.location = location;
        this.urlImage = urlImage;
        this.state = state;
        this.date = date;
        this.id = id;
    }


    @XmlElement
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @XmlElement
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @XmlElement
    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    @XmlElement
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @XmlElement
    public String getSeller() {
        return seller;
    }

    @XmlElement
    public StateId getState() {
        return state;
    }

    @XmlElement
    public LocalDateTime getDate() {
        return date;
    }

    @XmlElement
    public Integer getId() {
        return id;
    }

    public void setSeller(String seller) {
        this.seller = seller;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setState(StateId state) {
        this.state = state;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getUrlImage() {
        return urlImage;
    }

    public void setUrlImage(String urlImage) {
        this.urlImage = urlImage;
    }
}

