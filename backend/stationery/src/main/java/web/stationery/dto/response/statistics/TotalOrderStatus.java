package web.stationery.dto.response.statistics;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TotalOrderStatus {
    private List<String> labels = new ArrayList<>();
    private List<Integer> data= new ArrayList<>();
}