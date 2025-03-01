package web.stationery.dto.request.productrequest;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AdminProductRequest extends ProductRequest {
    private boolean deleteFlag;
} 