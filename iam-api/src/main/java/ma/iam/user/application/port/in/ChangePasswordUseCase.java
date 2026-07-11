package ma.iam.user.application.port.in;

import ma.iam.user.application.command.ChangePasswordCommand;

public interface ChangePasswordUseCase {

    void changePassword(ChangePasswordCommand command);
}
