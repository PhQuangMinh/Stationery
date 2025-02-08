package web.stationery.common.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import web.stationery.dto.response.CustomResponse;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({RuntimeException.class})
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public CustomResponse<Object> handleJsonProcessingException(Exception exception) {
        return handleException(exception);
    }

    private CustomResponse<Object> handleException(Exception exception) {
        log.error("Exception caught: ", exception);
        log.error("Error occurred: {}", exception.getMessage());
        return new CustomResponse<>(exception.getMessage());
    }
}
