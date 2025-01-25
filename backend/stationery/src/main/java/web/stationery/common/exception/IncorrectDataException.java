package web.stationery.common.exception;

import lombok.Getter;

@Getter
public class IncorrectDataException extends RuntimeException {
    public IncorrectDataException(String message){
        super(message);
    }
}
