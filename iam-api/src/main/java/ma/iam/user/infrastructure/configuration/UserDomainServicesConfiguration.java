package ma.iam.user.infrastructure.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import ma.iam.user.domain.service.VerificationTokenGenerator;

/**
 * Wires pure-domain services (which cannot carry Spring annotations) as beans.
 */
@Configuration
public class UserDomainServicesConfiguration {

    @Bean
    public VerificationTokenGenerator verificationTokenGenerator() {
        return new VerificationTokenGenerator();
    }
}
