package web.stationery.service;

public interface RedisService {
    void saveToken(String userId, String token);
    void deleteRefreshToken(String username);
    boolean isValidRefreshToken(String token, String username);
}
