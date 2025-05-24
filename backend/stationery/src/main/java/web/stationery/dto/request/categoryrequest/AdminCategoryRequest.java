package web.stationery.dto.request.categoryrequest;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminCategoryRequest extends CategoryRequest {
    private boolean deleteFlag;
}