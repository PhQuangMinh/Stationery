package web.stationery.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import web.stationery.dto.request.userrequest.RegisterUserRequest;
import web.stationery.dto.request.userrequest.UpdateUserRequest;
import web.stationery.dto.response.UserResponse;
import web.stationery.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(RegisterUserRequest userRequest);
    UserResponse toUserResponse(User user);
    void updateUser(@MappingTarget User user, UpdateUserRequest userRequest);
}
