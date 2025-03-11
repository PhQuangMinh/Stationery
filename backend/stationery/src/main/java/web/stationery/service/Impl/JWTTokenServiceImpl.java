package web.stationery.service.Impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import web.stationery.common.constant.Constant;
import web.stationery.service.JWTTokenService;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.Objects;

@Service
public class JWTTokenServiceImpl implements JWTTokenService {
    private final SecretKey secretKey = secretKey();

    public String generateAccessToken(UserDetails userDetails, Map<String, Object> claims) {
        Instant now = Instant.now();
        Instant expiration = Instant.now().plusSeconds(Constant.ACCESS_TOKEN_EXPIRATION);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiration))
                .signWith(secretKey)
                .compact();
    }

    @Override
    public String generateRefreshToken(UserDetails userDetails, Map<String, Object> claims) {
        Instant expiration = Instant.now().plusSeconds(Constant.REFRESH_TOKEN_EXPIRATION);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setExpiration(Date.from(expiration))
                .signWith(secretKey)
                .compact();
    }

    public Claims decodeToken(String token){
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(String token) {
        Claims claimsUser = decodeToken(token);
        return claimsUser.getSubject();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public Boolean isTokenExpired(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration()
                .before(new Date());

    }

    @Bean
    public SecretKey secretKey(){
        return Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }
}
