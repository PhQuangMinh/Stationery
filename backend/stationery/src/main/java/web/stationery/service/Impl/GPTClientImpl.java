package web.stationery.service.Impl;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import web.stationery.dto.request.GPTRequest;
import web.stationery.dto.response.CustomResponse;
import web.stationery.dto.response.GPTResponse;
import web.stationery.service.GPTClient;
import web.stationery.service.OrderService;
import web.stationery.service.ProductService;
import web.stationery.service.UserService;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GPTClientImpl implements GPTClient {
    public static final String FLOW_PROMPT_PATH = "classpath:prompt/flow_prompt.txt";

    private final WebClient webClient;

    private final Dotenv dotenv = Dotenv.load();

    private final String apiKey = dotenv.get("OPEN_API_KEY");

    private final String apiUrl = dotenv.get("GPT_API_URL");

    private final UserService userService;

    private final OrderService orderService;

    private final ProductService productService;

    private final ResourceLoader loader;

    public String getFlow(String question) throws IOException {
        String promptFlow = getPromptFromPath(FLOW_PROMPT_PATH);
        GPTRequest request = new GPTRequest(
                "gpt-4",
                List.of(new GPTRequest.Message("user", promptFlow + "\n" + question))
        );

        try {
            // Gửi request đến API GPT
            GPTResponse response = webClient.post()
                    .uri(apiUrl + "/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .body(Mono.just(request), GPTRequest.class)
                    .retrieve()
                    .bodyToMono(GPTResponse.class)
                    .block();

            assert response != null;
            return response.getChoices().getFirst().getMessage().getContent();
        } catch (WebClientResponseException e) {
            return "Error: " + e.getResponseBodyAsString();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    public String formatJsonFlow(String flow){
        System.out.println("đây là flow: " + flow);
        return flow.substring(flow.indexOf("{"), flow.lastIndexOf("}")+1);
    }

    public CustomResponse<?> generateAnswer(String username, String userInput) throws IOException {
        String flowResponse = formatJsonFlow(getFlow(userInput));
        JSONObject flowJson = new JSONObject(flowResponse);
        int flow = flowJson.getInt("status");
        System.out.println("FLOW: " + flow);
        return switch (flow) {
            case -1, 0 -> new CustomResponse<>(flowJson.getString("response"));
            case 1 -> new CustomResponse<>(userService.getTotalSpending(username));
            case 2 -> new CustomResponse<>(orderService.getLastOrder(username));
            case 3 -> new CustomResponse<>(productService.getBestSellingProduct());
            default -> new CustomResponse<>("Flow not found");
        };
    }

    @Override
    public String generateAnswer(String question, List<String> conversation) {
        return "";
    }

    @NotNull
    public String getPromptFromPath(String path) throws IOException {
        Resource resource = loader.getResource(path);
        InputStream input = resource.getInputStream();
        byte[] buffer = FileCopyUtils.copyToByteArray(input);
        return new String(buffer, StandardCharsets.UTF_8);
    }
}
