package ma.iam.user.application.port.in;

import ma.iam.user.application.command.CreateUserCommand;
import ma.iam.user.domain.valueobject.UserId;

public interface CreateUserUseCase {

    UserId create(CreateUserCommand command);
}
