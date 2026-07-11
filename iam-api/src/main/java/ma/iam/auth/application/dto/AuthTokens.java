package ma.iam.auth.application.dto;

public record AuthTokens(String accessToken, String refreshToken, long expiresInSeconds) {
}
