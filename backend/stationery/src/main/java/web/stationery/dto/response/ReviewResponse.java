package web.stationery.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
public class ReviewResponse {
    private int id;
    private String comment;
    private int rating;
    private Timestamp createdAt;
}
