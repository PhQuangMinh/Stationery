package web.stationery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringBootVersion;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StationeryApplication {

	public static void main(String[] args) {
		System.out.println("Spring Boot Version: " + SpringBootVersion.getVersion());
		SpringApplication.run(StationeryApplication.class, args);
	}

}
