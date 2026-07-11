package ma.iam.user.application.port.in;

import ma.iam.user.application.command.VerifyAccountCommand;

public interface VerifyAccountUseCase {

    void verify(VerifyAccountCommand command);
}
