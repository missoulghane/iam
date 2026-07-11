package ma.iam.auth.application.port.in;

import ma.iam.auth.application.command.RefreshTokenCommand;
import ma.iam.auth.application.dto.AuthTokens;

public interface RefreshTokenUseCase {

    AuthTokens refresh(RefreshTokenCommand command);
}
