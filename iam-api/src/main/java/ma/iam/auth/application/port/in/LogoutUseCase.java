package ma.iam.auth.application.port.in;

import ma.iam.auth.application.command.LogoutCommand;

public interface LogoutUseCase {

    void logout(LogoutCommand command);
}
