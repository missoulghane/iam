package ma.iam.user.application.dto;

import java.util.Set;

import ma.iam.user.domain.model.Role;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.valueobject.UserId;

public record UserView(UserId id, String email, String firstName, String lastName, Set<Role> roles,
                        boolean verified, boolean enabled) {

    public static UserView from(User user) {
        return new UserView(user.getId(), user.getEmail().value(), user.getFirstName(), user.getLastName(),
                user.getRoles(), user.isVerified(), user.isEnabled());
    }
}
