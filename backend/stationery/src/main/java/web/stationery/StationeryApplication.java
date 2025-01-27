package web.stationery;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StationeryApplication {

	private static final Dotenv dotenv = Dotenv.load();

	private static final String apiKey = dotenv.get("OPEN_API_KEY");

	public static void main(String[] args) {
		System.out.println(apiKey);
		SpringApplication.run(StationeryApplication.class, args);
	}

}
