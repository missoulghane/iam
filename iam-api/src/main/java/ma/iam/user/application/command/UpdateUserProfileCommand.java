package ma.iam.user.application.command;

import ma.iam.user.domain.valueobject.UserId;

public record UpdateUserProfileCommand(UserId userId, String firstName, String lastName) {
}
