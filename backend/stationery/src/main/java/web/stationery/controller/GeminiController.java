package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.stationery.service.GeminiClient;

import java.io.IOException;

@RestController
@RequestMapping("/gemini")
@RequiredArgsConstructor
public class GeminiController {

    private final GeminiClient geminiClient;

    @PostMapping("/ask")
    public ResponseEntity<String> askGemini(@RequestParam String userPrompt) throws IOException {
        String response = geminiClient.getDataFromPrompt(userPrompt);
        return ResponseEntity.ok(response);
    }
}