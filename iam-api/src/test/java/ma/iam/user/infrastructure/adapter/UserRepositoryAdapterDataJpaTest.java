package ma.iam.user.infrastructure.adapter;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import ma.iam.shared.domain.pagination.PageRequest;
import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.HashedPassword;
import ma.iam.shared.infrastructure.configuration.JpaAuditingConfiguration;
import ma.iam.user.domain.model.Role;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.valueobject.UserId;
import ma.iam.user.domain.valueobject.UserSearchCriteria;
import ma.iam.user.infrastructure.mapper.UserPersistenceMapperImpl;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({UserRepositoryAdapter.class, UserPersistenceMapperImpl.class, JpaAuditingConfiguration.class})
class UserRepositoryAdapterDataJpaTest {

    @Autowired
    private UserRepositoryAdapter adapter;

    private static User newUser() {
        return User.register(UserId.newId(), EmailVO.of("jpa-test@iam.ma"), HashedPassword.of("hashed"), "Jane", "Doe");
    }

    @Test
    void saves_and_finds_a_user_by_email() {
        User user = newUser();

        adapter.save(user);

        assertThat(adapter.findByEmail(EmailVO.of("jpa-test@iam.ma"))).isPresent()
                .get().extracting(User::getFirstName).isEqualTo("Jane");
    }

    @Test
    void existsByEmail_reflects_persisted_state() {
        assertThat(adapter.existsByEmail(EmailVO.of("nobody@iam.ma"))).isFalse();

        adapter.save(User.register(UserId.newId(), EmailVO.of("nobody@iam.ma"), HashedPassword.of("hashed"), "A", "B"));

        assertThat(adapter.existsByEmail(EmailVO.of("nobody@iam.ma"))).isTrue();
    }

    @Test
    void updating_a_user_persists_changes_without_creating_a_duplicate() {
        User user = newUser();
        adapter.save(user);

        adapter.save(user.verify().withProfile("Janet", "Doe"));

        User reloaded = adapter.findById(user.getId()).orElseThrow();
        assertThat(reloaded.isVerified()).isTrue();
        assertThat(reloaded.getFirstName()).isEqualTo("Janet");
    }

    @Test
    void findAll_paginates_results() {
        for (int i = 0; i < 3; i++) {
            adapter.save(User.register(UserId.newId(), EmailVO.of("user" + i + "@iam.ma"), HashedPassword.of("hashed"), "U", "" + i));
        }

        var page = adapter.findAll(PageRequest.of(0, 2), UserSearchCriteria.empty());

        assertThat(page.content()).hasSize(2);
        assertThat(page.totalElements()).isEqualTo(3);
    }

    @Test
    void findAll_filters_by_search_text() {
        adapter.save(User.register(UserId.newId(), EmailVO.of("alice@iam.ma"), HashedPassword.of("hashed"), "Alice", "Martin"));
        adapter.save(User.register(UserId.newId(), EmailVO.of("bob@iam.ma"), HashedPassword.of("hashed"), "Bob", "Durand"));

        var page = adapter.findAll(PageRequest.of(0, 20), new UserSearchCriteria("alice", null, null));

        assertThat(page.content()).extracting(User::getFirstName).containsExactly("Alice");
    }

    @Test
    void findAll_filters_by_role() {
        adapter.save(newUser());

        var matching = adapter.findAll(PageRequest.of(0, 20), new UserSearchCriteria(null, Role.ROLE_USER, null));
        var nonMatching = adapter.findAll(PageRequest.of(0, 20), new UserSearchCriteria(null, Role.ROLE_ADMIN, null));

        assertThat(matching.totalElements()).isEqualTo(1);
        assertThat(nonMatching.totalElements()).isZero();
    }

    @Test
    void findAll_filters_by_enabled_status() {
        User user = newUser();
        adapter.save(user.deactivate());

        var disabled = adapter.findAll(PageRequest.of(0, 20), new UserSearchCriteria(null, null, false));
        var enabled = adapter.findAll(PageRequest.of(0, 20), new UserSearchCriteria(null, null, true));

        assertThat(disabled.totalElements()).isEqualTo(1);
        assertThat(enabled.totalElements()).isZero();
    }

    @Test
    void findAll_combines_multiple_filters() {
        adapter.save(newUser());

        var page = adapter.findAll(PageRequest.of(0, 20), new UserSearchCriteria("jpa-test", Role.ROLE_USER, true));

        assertThat(page.totalElements()).isEqualTo(1);
    }

    @Test
    void deleteById_removes_the_user() {
        User user = newUser();
        adapter.save(user);

        adapter.deleteById(user.getId());

        assertThat(adapter.findById(user.getId())).isEmpty();
    }
}
