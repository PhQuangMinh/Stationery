package web.stationery.service.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.reactive.function.client.WebClient;
import web.stationery.dto.response.gemini.GeminiResponse;
import web.stationery.service.GeminiClient;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiClientImpl implements GeminiClient {

    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key}")
    private String geminiKey;

    private final ResourceLoader loader;

    public static final String FLOW_PROMPT_PATH = "classpath:prompt/flow_prompt.txt";

    @NotNull
    public String getPromptFromPath(String path) throws IOException {
        Resource resource = loader.getResource(path);
        InputStream input = resource.getInputStream();
        byte[] buffer = FileCopyUtils.copyToByteArray(input);
        return new String(buffer, StandardCharsets.UTF_8);
    }

    @Override
    public String getDataFromPrompt(String question) throws IOException {
        String API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=%s";
        String apiUrl = String.format(API_URL_TEMPLATE, geminiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        String requestBody;
        String prompt = getPromptFromPath(FLOW_PROMPT_PATH) + question;
        try {
            requestBody = objectMapper.writeValueAsString(makeBodyRequest(objectMapper, prompt));
        } catch (Exception e) {
            throw new RuntimeException("Failed to construct JSON request body", e);
        }

        log.info("Request: {}", requestBody);
        WebClient webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
                
        String response = webClient.post()
                .uri(apiUrl)
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
                
        try {
            GeminiResponse geminiResponse = objectMapper.readValue(response, GeminiResponse.class);
            if (geminiResponse != null && 
                !geminiResponse.getCandidates().isEmpty() && 
                geminiResponse.getCandidates().get(0).getContent() != null &&
                !geminiResponse.getCandidates().get(0).getContent().getParts().isEmpty()) {
                
                String text = geminiResponse.getCandidates().get(0).getContent().getParts().get(0).getText();
                System.out.println(text);
                try {
                    ObjectNode jsonNode = (ObjectNode) objectMapper.readTree(text);
                    if (jsonNode.has("response")) {
                        return jsonNode.get("response").asText();
                    }
                } catch (Exception e) {
                    return text;
                }
            }
            return "No response generated";
        } catch (Exception e) {
            log.error("Failed to parse Gemini response", e);
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }

    private ObjectNode makeBodyRequest(ObjectMapper objectMapper, String prompt) {
        ObjectNode contentNode = objectMapper.createObjectNode();
        ObjectNode partsNode = objectMapper.createObjectNode();
        partsNode.put("text", prompt);
        contentNode.set("parts", objectMapper.createArrayNode().add(partsNode));
        ObjectNode requestBodyNode = objectMapper.createObjectNode();
        requestBodyNode.set("contents", objectMapper.createArrayNode().add(contentNode));
        return requestBodyNode;
    }

} 