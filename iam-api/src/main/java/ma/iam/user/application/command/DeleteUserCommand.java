package ma.iam.user.application.command;

import ma.iam.user.domain.valueobject.UserId;

public record DeleteUserCommand(UserId userId) {
}
