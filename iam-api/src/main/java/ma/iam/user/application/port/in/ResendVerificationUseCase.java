package ma.iam.user.application.port.in;

import ma.iam.user.application.command.ResendVerificationCommand;

public interface ResendVerificationUseCase {

    void resend(ResendVerificationCommand command);
}
