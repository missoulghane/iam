package ma.iam.auth.application.command;

import ma.iam.shared.domain.valueobject.EmailVO;

public record RequestPasswordResetCommand(EmailVO email) {
}
