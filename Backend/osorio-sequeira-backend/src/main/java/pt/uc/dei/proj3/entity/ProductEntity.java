package pt.uc.dei.proj3.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name="product")

@NamedQuery(name = "Product.getAllProducts", query = "SELECT p FROM ProductEntity p")

@NamedQuery(name = "Product.getActiveProducts", query = "SELECT p FROM ProductEntity p WHERE excluded = false")

@NamedQuery(name = "Product.getEditedProducts", query = "SELECT p FROM ProductEntity p WHERE editedDate != date")

@NamedQuery(name = "Product.getAvailableProducts", query = "SELECT p FROM ProductEntity p WHERE state = 2 AND excluded = false")

@NamedQuery(name = "Product.getActiveProductsByUser", query = "SELECT p FROM ProductEntity p WHERE p.seller.username LIKE :username AND p.excluded = false")

@NamedQuery(name = "Product.getAllProductsByUser", query = "SELECT p FROM ProductEntity p WHERE p.seller.username LIKE :username")

@NamedQuery(name = "Product.getProductsByCategory", query = "SELECT p FROM ProductEntity p WHERE p.category.nome LIKE :category AND p.excluded = false AND state = 2")

@NamedQuery(name = "Product.getProductById", query = "SELECT p FROM ProductEntity p WHERE p.id = :id")

@NamedQuery(name = "Product.setProductsOfUserToExcluded", query = "UPDATE ProductEntity p SET excluded = true WHERE p.seller = :seller")

@NamedQuery(name = "Product.setProductsOfUserToAnonymous", query = "UPDATE ProductEntity p SET p.seller = :anonymous WHERE p.seller = :seller")

@NamedQuery(name = "Product.buyProduct", query = "UPDATE ProductEntity SET state = 4 WHERE id = :id")

@NamedQuery(name = "Product.excludeProduct", query = "UPDATE ProductEntity SET excluded = true WHERE id = :id")

@NamedQuery(name = "Product.deleteProduct", query = "DELETE FROM ProductEntity WHERE id = :id AND excluded = true")

@NamedQuery(name = "Product.setAllProductsCategoryToEmpty", query = "UPDATE ProductEntity SET category = :empty WHERE category = :category")

@NamedQuery(name = "Product.deleteProductsOfUser", query = "DELETE FROM ProductEntity WHERE seller = :seller")

public class ProductEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    //product unique has ID - not updatable, unique, not null
    @Id
    @Column(name="id", nullable=false, unique = true, updatable = false)
    private int id;

    //name
    @Column(name="name", nullable=false, unique = false, updatable = true)
    private String name;

    //description
    @Column(name="description", nullable=false, unique = false, updatable = true)
    private String description;

    //price
    @Column(name="price", nullable=false, unique = false, updatable = true)
    private Double price;

    //location
    @Column(name="location", nullable=false, unique = false, updatable = true)
    private String location;

    //state
    @Column(name="state", nullable=false, unique = false, updatable = true)
    private int state;

    //publishing date
    @Column(name="pubdate", nullable=false, unique = false, updatable = true)
    private LocalDateTime date;

    //Edited - time of last edit
    @Column(name="edited", nullable=false, unique = false, updatable = true)
    private LocalDateTime editedDate;

    //Url image
    @Column(name="urlimage", nullable=false, unique = false, updatable = true)
    private String urlImage;

    //Exluded - Boolean - is it excluded?
    @Column(name="excluded", nullable=false, unique = false, updatable = true)
    private Boolean excluded;

    @ManyToOne
    private UserEntity seller;

    @ManyToOne
    private CategoryEntity category;


    //Constructors
    public ProductEntity() {
    }

    //Setters and Getters
    public CategoryEntity getCategory() {
        return category;
    }

    public void setCategory(CategoryEntity category) {
        this.category = category;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getEditedDate() {
        return editedDate;
    }

    public void setEditedDate(LocalDateTime editedDate) {
        this.editedDate = editedDate;
    }

    public Boolean getExcluded() {
        return excluded;
    }

    public void setExcluded(Boolean excluded) {
        this.excluded = excluded;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public UserEntity getSeller() {
        return seller;
    }

    public void setSeller(UserEntity seller) {
        this.seller = seller;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    public String getUrlImage() {
        return urlImage;
    }

    public void setUrlImage(String urlImage) {
        this.urlImage = urlImage;
    }

    @Override
    public String toString() {
        return "ProductEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", location='" + location + '\'' +
                ", state=" + state +
                ", date=" + date +
                ", editedDate=" + editedDate +
                ", urlImage='" + urlImage + '\'' +
                ", excluded=" + excluded +
                ", seller=" + seller +
                ", category=" + category +
                '}';
    }
}
