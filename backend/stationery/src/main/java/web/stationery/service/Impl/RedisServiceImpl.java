package web.stationery.service.Impl;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import web.stationery.service.JWTTokenService;
import web.stationery.service.RedisService;

@Service
@Slf4j
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {
    private final RedisTemplate<String, String> redisTemplate;

    private final JWTTokenService jwtTokenService;

    private final String REFRESH_TOKEN_NAME = "refresh_token";

    @Override
    public void saveToken(String userId, String token) {
        try {
            redisTemplate.opsForHash().put(userId, REFRESH_TOKEN_NAME, token);
        }
        catch (Exception e) {
            log.error(e.getMessage());
            log.error("Error saving token to Redis");
        }
    }

    @Override
    public void deleteRefreshToken(String username){
        try{
            redisTemplate.opsForHash().delete(username, REFRESH_TOKEN_NAME);
        } catch (Exception e){
            log.error("Error deleting refresh token");
        }
    }

    @Override
    public boolean isValidRefreshToken(String token, String username) {
        String usernameCurrent = jwtTokenService.extractUsername(token);
        try{
            String usernameToken = jwtTokenService.extractUsername((String) redisTemplate.opsForHash().get(username, REFRESH_TOKEN_NAME));
            return usernameCurrent.equals(usernameToken);
        } catch (Exception e){
            log.error("Error validating refresh token");
            return false;
        }

    }
}
