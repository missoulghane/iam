package ma.iam.user.application.command;

import ma.iam.shared.domain.valueobject.RawPassword;
import ma.iam.user.domain.valueobject.UserId;

public record ChangePasswordCommand(UserId userId, RawPassword currentPassword, RawPassword newPassword) {
}
