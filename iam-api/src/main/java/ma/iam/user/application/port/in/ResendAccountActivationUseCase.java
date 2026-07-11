package ma.iam.user.application.port.in;

import ma.iam.user.application.command.ResendAccountActivationCommand;

public interface ResendAccountActivationUseCase {

    void resend(ResendAccountActivationCommand command);
}
