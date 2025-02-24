package pt.uc.dei.proj3.pojo;

import pt.uc.dei.proj3.dto.StateId;
import jakarta.xml.bind.annotation.XmlElement;

import java.io.Serializable;
import java.time.LocalDateTime;

public class ProductPojo implements Serializable {
    private int id;
    private String seller;
    private String name;
    private String description;
    private double price;
    private String category;
    private String location;
    private String urlImage;
    private StateId state;
    private LocalDateTime date;


    public ProductPojo(String seller, String name, String description, double price, String category, String location, String urlImage) {
        this.seller = seller;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.location = location;
        this.urlImage = urlImage;
        this.state = StateId.RASCUNHO;
        this.date = LocalDateTime.now();
        this.id = generateHash(seller, name, description, price, category, location, urlImage, this.date);
    }

    //Versão integral para loading
    public ProductPojo(String seller, String name, String description, double price, String category, String location, String urlImage, StateId state, LocalDateTime date, int id) {
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

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setSeller(String seller) {
        this.seller = seller;
    }

    public void setState(StateId state) {
        this.state = state;
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

    @XmlElement
    public LocalDateTime getDate() {
        return date;
    }

    @XmlElement
    public Integer getId() {
        return id;
    }

    private Integer generateHash(String seller, String name, String description, double price, String category, String location, String urlImage, LocalDateTime date) {
        int hash = 0;
        String string = seller.concat(name).concat(description).concat(String.valueOf(price)).concat(category).concat(location).concat(urlImage).concat(date.toString());
        for (int i = 0; i < string.length(); i++) {
            int chr = Character.codePointAt(string, i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
}