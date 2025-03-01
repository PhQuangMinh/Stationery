package web.stationery.dto.request.categoryrequest;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminCategoryRequest extends CategoryRequest {
    private String name;
    private Integer parentId;
    private boolean deleteFlag;
}