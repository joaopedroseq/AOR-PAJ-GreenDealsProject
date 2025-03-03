package pt.uc.dei.proj3.dto;

import jakarta.xml.bind.annotation.XmlRootElement;

import java.io.Serializable;

@XmlRootElement
public class NewProductDto implements Serializable {
    private String seller;
    private String name;
    private String description;
    private double price;
    private String category;
    private String location;
    private String urlImage;

    public NewProductDto() {

    }

    public String getSeller() {
        return seller;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }

    public String getLocation() {
        return location;
    }

    public String getUrlImage() {
        return urlImage;
    }

    public void setSeller(String seller) {
        this.seller = seller;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setUrlImage(String urlImage) {
        this.urlImage = urlImage;
    }

    public boolean isValid(){
        return this.seller != null && !this.seller.isEmpty()
                && this.name != null && !this.name.isEmpty()
                && this.description != null && !this.description.isEmpty()
                && this.price != 0
                && this.category != null && !this.category.isEmpty()
                && this.location != null && !this.location.isEmpty()
                && this.urlImage != null && !this.urlImage.isEmpty();
    }

    @Override
    public String toString() {
        return "NewProductDto{" +
                "seller='" + seller + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", category='" + category + '\'' +
                ", location='" + location + '\'' +
                ", urlImage='" + urlImage + '\'' +
                '}';
    }
}
