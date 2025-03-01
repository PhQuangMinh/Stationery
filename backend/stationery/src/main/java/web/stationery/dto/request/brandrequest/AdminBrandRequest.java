package web.stationery.dto.request.brandrequest;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AdminBrandRequest extends BrandRequest {
    private boolean deleteFlag;
} 