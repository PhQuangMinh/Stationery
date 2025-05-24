package web.stationery.common.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;

public class PageableUtils {
    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final int DEFAULT_PAGE_SIZE = 100;

    public static Pageable createPageable(int size, int page, String sortBy){
        return PageRequest.of(Math.max(page, DEFAULT_PAGE_NUMBER), Math.min(size, DEFAULT_PAGE_SIZE), Sort.Direction.ASC, sortBy);
    }
}
