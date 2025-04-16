package web.stationery.service;

import web.stationery.dto.response.statistics.StatisticsResponse;

import java.util.Map;

public interface StatisticsService {
    Map<String, Object> getStatistics();
}
