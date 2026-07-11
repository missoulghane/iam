package ma.iam.auth.web.response;

import ma.iam.auth.application.dto.AuthTokens;

public record AuthResponse(String accessToken, String refreshToken, String tokenType, long expiresIn) {

    public static AuthResponse from(AuthTokens tokens) {
        return new AuthResponse(tokens.accessToken(), tokens.refreshToken(), "Bearer", tokens.expiresInSeconds());
    }
}
