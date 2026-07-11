package ma.iam.user.infrastructure.adapter;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import ma.iam.shared.domain.pagination.Page;
import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.repository.UserRepository;
import ma.iam.user.domain.valueobject.UserId;
import ma.iam.user.domain.valueobject.UserSearchCriteria;
import ma.iam.user.infrastructure.mapper.UserPersistenceMapper;
import ma.iam.user.infrastructure.persistence.UserEntity;
import ma.iam.user.infrastructure.persistence.UserJpaRepository;
import ma.iam.user.infrastructure.persistence.UserSpecifications;

@Component
public class UserRepositoryAdapter implements UserRepository {

    private final UserJpaRepository jpaRepository;
    private final UserPersistenceMapper mapper;

    public UserRepositoryAdapter(UserJpaRepository jpaRepository, UserPersistenceMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public User save(User user) {
        UserEntity entity = jpaRepository.findById(user.getId().asUuid()).orElseGet(UserEntity::new);
        UserEntity saved = jpaRepository.save(mapper.toEntity(user, entity));
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<User> findById(UserId id) {
        return jpaRepository.findById(id.asUuid()).map(mapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(EmailVO email) {
        return jpaRepository.findByEmail(email.value()).map(mapper::toDomain);
    }

    @Override
    public boolean existsByEmail(EmailVO email) {
        return jpaRepository.existsByEmail(email.value());
    }

    @Override
    public Page<User> findAll(ma.iam.shared.domain.pagination.PageRequest pageRequest, UserSearchCriteria criteria) {
        Pageable pageable = Pageable.ofSize(pageRequest.pageSize()).withPage(pageRequest.pageNumber());
        Specification<UserEntity> specification = UserSpecifications.matching(criteria);
        org.springframework.data.domain.Page<UserEntity> springPage = jpaRepository.findAll(specification, pageable);
        List<User> content = springPage.getContent().stream().map(mapper::toDomain).toList();
        return Page.of(content, pageRequest.pageNumber(), pageRequest.pageSize(), springPage.getTotalElements());
    }

    @Override
    public void deleteById(UserId id) {
        jpaRepository.deleteById(id.asUuid());
    }
}
