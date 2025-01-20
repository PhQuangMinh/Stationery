package web.stationery.service;

import org.springframework.security.core.userdetails.UserDetails;

public interface JWTTokenService {
    String generateToken(UserDetails userDetails);

    String extractUsername(String token);

    Boolean validateToken(String token, UserDetails userDetails);

    Boolean isTokenExpired(String token);
}
