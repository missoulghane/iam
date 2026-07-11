package ma.iam.user.application.port.in;

import ma.iam.user.application.command.RegisterUserCommand;
import ma.iam.user.domain.valueobject.UserId;

public interface RegisterUserUseCase {

    UserId register(RegisterUserCommand command);
}
