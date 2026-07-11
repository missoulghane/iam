package ma.iam.user.web.response;

import java.util.Set;

import ma.iam.user.application.dto.UserView;

public record UserResponse(String id, String email, String firstName, String lastName, Set<String> roles,
                            boolean verified, boolean enabled) {

    public static UserResponse from(UserView view) {
        return new UserResponse(
                view.id().toString(),
                view.email(),
                view.firstName(),
                view.lastName(),
                view.roles().stream().map(Enum::name).collect(java.util.stream.Collectors.toSet()),
                view.verified(),
                view.enabled());
    }
}
