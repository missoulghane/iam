package ma.iam.user.application.port.in;

import ma.iam.user.application.command.DeleteUserCommand;

public interface DeleteUserUseCase {

    void delete(DeleteUserCommand command);
}
