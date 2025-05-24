package web.stationery.dto.request;

import java.util.List;
import java.util.Map;

public class GeminiRequest {
    private List<Map<String, String>> contents;

    public GeminiRequest(List<Map<String, String>> contents) {
        this.contents = contents;
    }

    public List<Map<String, String>> getContents() {
        return contents;
    }

    public void setContents(List<Map<String, String>> contents) {
        this.contents = contents;
    }
}