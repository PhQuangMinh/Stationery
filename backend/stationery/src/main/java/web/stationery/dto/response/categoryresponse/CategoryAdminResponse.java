package web.stationery.dto.response.categoryresponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryAdminResponse extends CategoryResponse{
    private boolean deleteFlag;
    private List<CategoryAdminResponse> children;
}
