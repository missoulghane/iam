package ma.iam.testsupport;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

import ma.iam.auth.infrastructure.security.DomainUserDetailsService;
import ma.iam.auth.infrastructure.security.JwtService;
import ma.iam.auth.infrastructure.security.RestAccessDeniedHandler;
import ma.iam.auth.infrastructure.security.RestAuthenticationEntryPoint;
import ma.iam.auth.infrastructure.security.SecurityConfiguration;
import ma.iam.shared.infrastructure.configuration.PasswordEncoderConfiguration;

/**
 * @WebMvcTest(controllers = ...) only whitelists a narrow set of bean types
 * (@Controller, @ControllerAdvice, WebMvcConfigurer, Filter, ...) - our custom
 * SecurityConfiguration is a plain @Configuration and is excluded from that slice
 * by default, so the real Spring Security filter chain never runs and requests
 * reach controllers with a null Authentication. Import this into any @WebMvcTest
 * that needs genuine authentication/authorization enforcement (401/403, current
 * user id from the JWT subject, @PreAuthorize).
 */
@TestConfiguration
@Import({
        PasswordEncoderConfiguration.class,
        SecurityConfiguration.class,
        JwtService.class,
        RestAuthenticationEntryPoint.class,
        RestAccessDeniedHandler.class
})
public class WebSecuritySliceTestConfiguration {

    @Bean
    DomainUserDetailsService domainUserDetailsService() {
        return Mockito.mock(DomainUserDetailsService.class);
    }
}
