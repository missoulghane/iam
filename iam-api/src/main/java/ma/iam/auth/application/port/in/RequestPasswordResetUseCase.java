package ma.iam.auth.application.port.in;

import ma.iam.auth.application.command.RequestPasswordResetCommand;

public interface RequestPasswordResetUseCase {

    void requestReset(RequestPasswordResetCommand command);
}
