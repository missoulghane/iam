package ma.iam.user.application.command;

import ma.iam.shared.domain.valueobject.RawPassword;

public record ActivateAccountCommand(String token, RawPassword newPassword) {
}
