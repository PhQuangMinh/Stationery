package web.stationery.service;

import web.stationery.dto.response.CustomResponse;

import java.io.IOException;
import java.util.List;

public interface GPTClient {
    String generateAnswer(String question, List<String> conversation);
    CustomResponse<?> generateAnswer(String username, String question) throws IOException;
}
