package web.stationery.dto.request.categoryrequest;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CategoryRequest {
    private String name;
    private Integer parentId;
    private boolean deleteFlag;
}
