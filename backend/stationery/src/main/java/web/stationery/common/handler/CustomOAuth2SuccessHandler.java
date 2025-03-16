package web.stationery.common.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import web.stationery.common.constant.Role;
import web.stationery.model.User;
import web.stationery.service.JWTTokenService;
import web.stationery.service.RedisService;
import web.stationery.service.UserService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final JWTTokenService jwtTokenService;

    private final UserService userService;

    private final RedisService redisService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = userService.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setRole(Role.ROLE_USER);
            user.setUsername(email);
            user.setPassword("");
            user = userService.save(user);
        }

        String accessToken = jwtTokenService.generateAccessToken((UserDetails) user, new HashMap<>());
        String refreshToken = jwtTokenService.generateRefreshToken((UserDetails) user, new HashMap<>());
        redisService.saveToken(user.getUsername(), refreshToken);

        String redirectUrl = String.format(
                "http://localhost:5501/templates/landingpage/landingpage.html?token=%s&username=%s"
                , accessToken, user.getUsername());

        response.sendRedirect(redirectUrl);
    }
}
