package ma.iam.auth.application.command;

import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.RawPassword;

public record LoginCommand(EmailVO email, RawPassword password) {
}
