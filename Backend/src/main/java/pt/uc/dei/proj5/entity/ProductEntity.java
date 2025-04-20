package pt.uc.dei.proj5.entity;

import jakarta.persistence.*;
import pt.uc.dei.proj5.dto.ProductStateId;

import java.io.Serializable;
import java.time.LocalDateTime;



//Rever quais são para apagar
@NamedQuery(name = "Product.getProductById", query = "SELECT p FROM ProductEntity p WHERE p.id = :id")

@NamedQuery(name = "Product.buyProduct", query = "UPDATE ProductEntity SET state = 'COMPRADO' WHERE id = :id")

@NamedQuery(name = "Product.setProductsOfUserToExcluded", query = "UPDATE ProductEntity p SET excluded = true WHERE p.seller = :seller")

@NamedQuery(name = "Product.setProductsOfUserToAnonymous", query = "UPDATE ProductEntity p SET p.seller = :anonymous WHERE p.seller = :seller")

@NamedQuery(name = "Product.deleteProductsOfUser", query = "DELETE FROM ProductEntity WHERE seller = :seller")

@NamedQuery(name = "Product.deleteProduct", query = "DELETE FROM ProductEntity WHERE id = :id")

@NamedQuery(name = "Product.setAllProductsCategoryToEmpty", query = "UPDATE ProductEntity SET category = :empty WHERE category = :category")

@Entity
@Table(name="product", indexes = {
        @Index(name = "idx_product_id", columnList = "id"),
        @Index(name = "idx_product_seller", columnList = "seller"),
        @Index(name = "idx_product_category", columnList = "category"),
        @Index(name = "idx_filtered_products", columnList = "seller, state, excluded, category, date")
})
public class ProductEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    //product unique has ID - not updatable, unique, not null
    @Id
    @Column(name="id", nullable=false, unique = true, updatable = false)
    private Long id;

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

    @Enumerated(EnumType.STRING)
    @Column(name="state", nullable=false, unique = false, updatable = true)
    private ProductStateId state;

    //publishing date
    @Column(name="date", nullable=false, unique = false, updatable = true)
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
    @JoinColumn(name = "seller", nullable = false)
    private UserEntity seller;

    @ManyToOne
    @JoinColumn(name = "category", nullable = false)
    private CategoryEntity category;

    @ManyToOne
    @JoinColumn(name = "buyer", nullable = true)
    private UserEntity buyer;


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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public ProductStateId getState() {
        return state;
    }

    public void setState(ProductStateId state) {
        this.state = state;
    }

    public String getUrlImage() {
        return urlImage;
    }

    public void setUrlImage(String urlImage) {
        this.urlImage = urlImage;
    }

    public UserEntity getBuyer() {
        return buyer;
    }

    public void setBuyer(UserEntity buyer) {
        this.buyer = buyer;
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
