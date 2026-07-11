package ma.iam.auth.application.port.in;

import ma.iam.auth.application.command.ResetPasswordCommand;

public interface ResetPasswordUseCase {

    void resetPassword(ResetPasswordCommand command);
}
