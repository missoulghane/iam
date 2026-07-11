package ma.iam.user.application.command;

import ma.iam.shared.domain.valueobject.EmailVO;

public record CreateUserCommand(EmailVO email, String firstName, String lastName) {
}
