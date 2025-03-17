package web.stationery.model.elasticsearch;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "products")
public class ProductDocument {
    
    @Id
    private Integer id;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;
    
    @Field(type = FieldType.Text)
    private String description;
    
    @Field(type = FieldType.Integer)
    private Integer price;
    
    @Field(type = FieldType.Integer)
    private Integer quantity;
    
    @Field(type = FieldType.Integer)
    private Integer countSales;
    
    @Field(type = FieldType.Integer)
    private Integer discount;
    
    @Field(type = FieldType.Text)
    private String imageUrl;
    
    @Field(type = FieldType.Object)
    private BrandDocument brand;
    
    @Field(type = FieldType.Nested)
    private List<CategoryDocument> categories;
    
    @Field(type = FieldType.Date)
    private Date createdAt;
    
    @Field(type = FieldType.Date)
    private Date updatedAt;
}

