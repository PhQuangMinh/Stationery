package web.stationery.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private boolean deleteFlag;
    private List<CategoryResponse> children;

    public CategoryResponse(Integer id, String name, Integer parentId, boolean deleteFlag) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.deleteFlag = deleteFlag;
    }
}