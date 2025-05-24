package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import web.stationery.dto.response.CustomResponse;
import web.stationery.service.StatisticsService;

@RestController
@RequestMapping("/admin/statistics")
@RequiredArgsConstructor
public class StatisticsController {
    private final StatisticsService statisticsService;

    @GetMapping()
    public CustomResponse<?> getStatistics(@RequestParam int year) {
        return new CustomResponse<>(statisticsService.getStatistics(year));
    }
}