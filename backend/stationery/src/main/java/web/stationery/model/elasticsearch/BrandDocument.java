package web.stationery.model.elasticsearch;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrandDocument {
    
    @Field(type = FieldType.Integer)
    private Integer id;
    
    @Field(type = FieldType.Text)
    private String name;
}
