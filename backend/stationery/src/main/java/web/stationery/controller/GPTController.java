package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import web.stationery.dto.response.CustomResponse;
import web.stationery.service.GPTClient;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class GPTController {
    private final GPTClient gptClient;

    @GetMapping("/{username}/get-answer")
    public CustomResponse<?> getAnswer(@PathVariable String username, @RequestParam String question) throws IOException {
        return gptClient.generateAnswer(username, question);
    }
}
