package ma.iam.auth.application.command;

import ma.iam.shared.domain.valueobject.RawPassword;

public record ResetPasswordCommand(String token, RawPassword newPassword) {
}
