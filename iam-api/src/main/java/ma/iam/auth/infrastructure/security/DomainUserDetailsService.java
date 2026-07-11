package ma.iam.auth.infrastructure.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.user.application.port.in.LoadUserByEmailUseCase;
import ma.iam.user.domain.model.User;

/**
 * Only auth.infrastructure component allowed to depend on the user feature: it goes
 * through user's public port-in (LoadUserByEmailUseCase), never through its
 * repository directly. auth.application stays fully decoupled from user.
 */
@Component
public class DomainUserDetailsService implements UserDetailsService {

    private final LoadUserByEmailUseCase loadUserByEmailUseCase;

    public DomainUserDetailsService(LoadUserByEmailUseCase loadUserByEmailUseCase) {
        this.loadUserByEmailUseCase = loadUserByEmailUseCase;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = loadUserByEmailUseCase.loadByEmail(EmailVO.of(email))
                .orElseThrow(() -> new UsernameNotFoundException("No account found for email: " + email));
        return UserPrincipal.of(user);
    }
}
