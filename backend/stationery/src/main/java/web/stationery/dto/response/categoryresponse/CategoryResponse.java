package web.stationery.dto.response.categoryresponse;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Integer id;
    private String name;
    private Integer parentId;

    public CategoryResponse(Integer id, String name){
        this.id = id;
        this.name = name;
    }
}