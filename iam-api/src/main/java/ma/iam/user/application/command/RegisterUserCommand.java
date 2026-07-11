package ma.iam.user.application.command;

import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.RawPassword;

public record RegisterUserCommand(EmailVO email, RawPassword password, String firstName, String lastName) {
}
