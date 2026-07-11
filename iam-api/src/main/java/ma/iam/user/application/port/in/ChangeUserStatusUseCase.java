package ma.iam.user.application.port.in;

import ma.iam.user.application.command.ChangeUserStatusCommand;
import ma.iam.user.application.dto.UserView;

public interface ChangeUserStatusUseCase {

    UserView changeStatus(ChangeUserStatusCommand command);
}
