package web.stationery;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringBootVersion;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import web.stationery.service.Impl.RedisServiceImpl;
import web.stationery.service.RedisService;

import java.util.concurrent.TimeUnit;

@SpringBootApplication
public class StationeryApplication {
	public static void main(String[] args) {
		SpringApplication.run(StationeryApplication.class, args);
	}

}
