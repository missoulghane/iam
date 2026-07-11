package ma.iam.user.application.port.in;

import ma.iam.user.application.command.UpdateUserProfileCommand;
import ma.iam.user.application.dto.UserView;

public interface UpdateUserProfileUseCase {

    UserView updateProfile(UpdateUserProfileCommand command);
}
