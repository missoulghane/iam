package ma.iam.user.domain.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.HashedPassword;
import ma.iam.user.domain.valueobject.UserId;

class UserTest {

    private static User newUser() {
        return User.register(UserId.newId(), EmailVO.of("a@b.com"), HashedPassword.of("hashed"), "Jane", "Doe");
    }

    @Test
    void register_creates_an_unverified_user_with_default_role() {
        User user = newUser();

        assertThat(user.isVerified()).isFalse();
        assertThat(user.isEnabled()).isTrue();
        assertThat(user.getRoles()).containsExactly(Role.ROLE_USER);
    }

    @Test
    void registerByAdmin_creates_an_unverified_but_enabled_user_with_default_role() {
        User user = User.registerByAdmin(UserId.newId(), EmailVO.of("admin-created@b.com"), HashedPassword.of("hashed"),
                "Jane", "Doe");

        assertThat(user.isVerified()).isFalse();
        assertThat(user.isEnabled()).isTrue();
        assertThat(user.getRoles()).containsExactly(Role.ROLE_USER);
    }

    @Test
    void deactivate_and_activate_toggle_enabled_and_are_idempotent() {
        User user = newUser();

        User deactivated = user.deactivate();
        assertThat(deactivated.isEnabled()).isFalse();
        assertThat(deactivated.deactivate()).isSameAs(deactivated);

        User reactivated = deactivated.activate();
        assertThat(reactivated.isEnabled()).isTrue();
        assertThat(reactivated.activate()).isSameAs(reactivated);
    }

    @Test
    void verify_returns_a_new_verified_instance_with_same_identity() {
        User user = newUser();

        User verified = user.verify();

        assertThat(verified.isVerified()).isTrue();
        assertThat(verified).isEqualTo(user);
        assertThat(user.isVerified()).isFalse();
    }

    @Test
    void equality_is_based_on_identity_not_on_field_values() {
        User a = User.register(UserId.newId(), EmailVO.of("a@b.com"), HashedPassword.of("hashed"), "Jane", "Doe");
        User b = User.register(a.getId(), EmailVO.of("different@b.com"), HashedPassword.of("other"), "John", "Smith");

        assertThat(a).isEqualTo(b);
    }

    @Test
    void withPassword_replaces_only_the_password() {
        User user = newUser();

        User updated = user.withPassword(HashedPassword.of("new-hash"));

        assertThat(updated.getPassword().value()).isEqualTo("new-hash");
        assertThat(updated.getEmail()).isEqualTo(user.getEmail());
    }
}
