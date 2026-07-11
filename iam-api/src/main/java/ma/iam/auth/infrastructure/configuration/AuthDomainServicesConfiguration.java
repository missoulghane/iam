package ma.iam.auth.infrastructure.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import ma.iam.auth.domain.service.PasswordResetTokenGenerator;
import ma.iam.auth.domain.service.RefreshTokenSecretGenerator;

@Configuration
public class AuthDomainServicesConfiguration {

    @Bean
    public RefreshTokenSecretGenerator refreshTokenSecretGenerator() {
        return new RefreshTokenSecretGenerator();
    }

    @Bean
    public PasswordResetTokenGenerator passwordResetTokenGenerator() {
        return new PasswordResetTokenGenerator();
    }
}
