package ma.iam.user.domain.model;

import java.util.Objects;
import java.util.Set;

import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.HashedPassword;
import ma.iam.user.domain.valueobject.UserId;

/**
 * User account aggregate. Immutable: every mutation returns a new instance.
 * Entity semantics: equals/hashCode are identity-based (on id), not value-based.
 */
public final class User {

    private final UserId id;
    private final EmailVO email;
    private final HashedPassword password;
    private final String firstName;
    private final String lastName;
    private final Set<Role> roles;
    private final boolean verified;
    private final boolean enabled;

    private User(UserId id, EmailVO email, HashedPassword password, String firstName, String lastName,
                  Set<Role> roles, boolean verified, boolean enabled) {
        this.id = Objects.requireNonNull(id, "id must not be null");
        this.email = Objects.requireNonNull(email, "email must not be null");
        this.password = Objects.requireNonNull(password, "password must not be null");
        this.firstName = requireNonBlank(firstName, "firstName");
        this.lastName = requireNonBlank(lastName, "lastName");
        this.roles = Set.copyOf(Objects.requireNonNull(roles, "roles must not be null"));
        if (this.roles.isEmpty()) {
            throw new IllegalArgumentException("a user must have at least one role");
        }
        this.verified = verified;
        this.enabled = enabled;
    }

    public static User register(UserId id, EmailVO email, HashedPassword password, String firstName, String lastName) {
        return new User(id, email, password, firstName, lastName, Set.of(Role.ROLE_USER), false, true);
    }

    /**
     * Admin-created accounts still go through activation: the password passed
     * here is a random, server-generated placeholder (never usable, since
     * verified=false already blocks login) until the invited user activates their
     * account and chooses their own password via {@link #verify()}/{@link
     * #withPassword(HashedPassword)}.
     */
    public static User registerByAdmin(UserId id, EmailVO email, HashedPassword password, String firstName,
                                        String lastName) {
        return new User(id, email, password, firstName, lastName, Set.of(Role.ROLE_USER), false, true);
    }

    public static User reconstruct(UserId id, EmailVO email, HashedPassword password, String firstName,
                                    String lastName, Set<Role> roles, boolean verified, boolean enabled) {
        return new User(id, email, password, firstName, lastName, roles, verified, enabled);
    }

    public User verify() {
        if (verified) {
            return this;
        }
        return new User(id, email, password, firstName, lastName, roles, true, enabled);
    }

    public User withProfile(String newFirstName, String newLastName) {
        return new User(id, email, password, newFirstName, newLastName, roles, verified, enabled);
    }

    public User withPassword(HashedPassword newPassword) {
        return new User(id, email, newPassword, firstName, lastName, roles, verified, enabled);
    }

    public User withRoles(Set<Role> newRoles) {
        return new User(id, email, password, firstName, lastName, newRoles, verified, enabled);
    }

    /**
     * Admin-triggered account status, independent of email verification: a
     * disabled account cannot authenticate regardless of {@link #verified}.
     */
    public User activate() {
        if (enabled) {
            return this;
        }
        return new User(id, email, password, firstName, lastName, roles, verified, true);
    }

    public User deactivate() {
        if (!enabled) {
            return this;
        }
        return new User(id, email, password, firstName, lastName, roles, verified, false);
    }

    private static String requireNonBlank(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " must not be blank");
        }
        return value;
    }

    public UserId getId() {
        return id;
    }

    public EmailVO getEmail() {
        return email;
    }

    public HashedPassword getPassword() {
        return password;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public boolean isVerified() {
        return verified;
    }

    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        return o instanceof User other && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
