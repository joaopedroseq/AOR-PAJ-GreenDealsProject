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
    private boolean excluded;
    private LocalDateTime edited;

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

    public ProductDto(ProductDto productDto) {
        this.seller = productDto.seller;
        this.name = productDto.name;
        this.description = productDto.description;
        this.price = productDto.price;
        this.category = productDto.category;
        this.location = productDto.location;
        this.urlImage = productDto.urlImage;
        this.state = StateId.RASCUNHO;
        this.date = LocalDateTime.now();
        this.id = generateHash(seller,name,description,price,category,location,urlImage,date);
        this.excluded = false;
        this.edited = date;

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
    public boolean isExcluded() {
        return excluded;
    }
    public void setExcluded(boolean excluded) {
        this.excluded = excluded;
    }
    public LocalDateTime getEdited() {
        return edited;
    }
    public void setEdited(LocalDateTime edited) {
        this.edited = edited;
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
    public boolean newProductIsValid(){
        return this.seller != null && !this.seller.isEmpty()
                && this.name != null && !this.name.isEmpty()
                && this.description != null && !this.description.isEmpty()
                && this.price != 0
                && this.category != null && !this.category.isEmpty()
                && this.location != null && !this.location.isEmpty()
                && this.urlImage != null && !this.urlImage.isEmpty();

    }
    public boolean isValid(){
        return this.id != null && this.id != null
                && this.seller != null && !this.seller.isEmpty()
                && this.name != null && !this.name.isEmpty()
                && this.description != null && !this.description.isEmpty()
                && this.price != 0
                && this.category != null && !this.category.isEmpty()
                && this.location != null && !this.location.isEmpty()
                && this.urlImage != null && !this.urlImage.isEmpty()
                && this.state != null
                && this.date != null;
    }

    @Override
    public String toString() {
        return "ProductDto{" +
                "id=" + id +
                ", seller='" + seller + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", category='" + category + '\'' +
                ", location='" + location + '\'' +
                ", urlImage='" + urlImage + '\'' +
                ", state=" + state +
                ", date=" + date +
                '}';
    }
}

