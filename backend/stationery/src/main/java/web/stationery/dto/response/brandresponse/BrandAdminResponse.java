package web.stationery.dto.response.brandresponse;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BrandAdminResponse extends BrandResponse{
    private boolean deleteFlag;
}
