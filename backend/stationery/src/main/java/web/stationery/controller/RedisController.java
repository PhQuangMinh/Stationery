package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import web.stationery.dto.response.CustomResponse;
import web.stationery.service.RedisService;

@RestController
@RequiredArgsConstructor
public class RedisController {
    private final RedisService redisService;

    @GetMapping("/redis/save")
    public void putNewRefreshToken() {
        redisService.saveToken("1000", "1");
    }

    @DeleteMapping("/redis/delete")
    public void deleteRedis() {
        redisService.deleteRefreshToken("1");
    }
}
