package web.stationery.service;

import java.io.IOException;

public interface GeminiClient {
    String getDataFromPrompt(String prompt) throws IOException;
} 