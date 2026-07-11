package ma.iam.auth.application.port.in;

import ma.iam.auth.application.command.LoginCommand;
import ma.iam.auth.application.dto.AuthTokens;

public interface LoginUseCase {

    AuthTokens login(LoginCommand command);
}
