package web.stationery.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {

    @Bean
    public ObjectMapper getObjectMapper() {
        return new ObjectMapper();
    }
}
