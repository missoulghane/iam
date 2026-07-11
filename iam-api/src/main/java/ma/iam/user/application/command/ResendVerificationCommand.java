package ma.iam.user.application.command;

import ma.iam.shared.domain.valueobject.EmailVO;

public record ResendVerificationCommand(EmailVO email) {
}
