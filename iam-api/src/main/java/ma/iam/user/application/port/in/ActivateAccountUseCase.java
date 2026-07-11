package ma.iam.user.application.port.in;

import ma.iam.user.application.command.ActivateAccountCommand;

public interface ActivateAccountUseCase {

    void activate(ActivateAccountCommand command);
}
