package ma.iam.auth.infrastructure.adapter;

import java.util.Optional;

import org.springframework.stereotype.Component;

import ma.iam.auth.domain.model.PasswordResetToken;
import ma.iam.auth.domain.repository.PasswordResetTokenRepository;
import ma.iam.auth.domain.valueobject.PasswordResetTokenId;
import ma.iam.auth.infrastructure.persistence.PasswordResetTokenEntity;
import ma.iam.auth.infrastructure.persistence.PasswordResetTokenJpaRepository;
import ma.iam.shared.domain.valueobject.EntityId;

@Component
public class PasswordResetTokenRepositoryAdapter implements PasswordResetTokenRepository {

    private final PasswordResetTokenJpaRepository jpaRepository;

    public PasswordResetTokenRepositoryAdapter(PasswordResetTokenJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public PasswordResetToken save(PasswordResetToken token) {
        PasswordResetTokenEntity entity = new PasswordResetTokenEntity();
        entity.setId(token.id().asUuid());
        entity.setUserId(token.userId().value());
        entity.setToken(token.token());
        entity.setExpiresAt(token.expiresAt());
        PasswordResetTokenEntity saved = jpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<PasswordResetToken> findByToken(String tokenValue) {
        return jpaRepository.findByToken(tokenValue).map(this::toDomain);
    }

    @Override
    public void deleteByUserId(EntityId userId) {
        jpaRepository.deleteByUserId(userId.value());
    }

    private PasswordResetToken toDomain(PasswordResetTokenEntity entity) {
        return new PasswordResetToken(
                PasswordResetTokenId.of(entity.getId()),
                EntityId.of(entity.getUserId()),
                entity.getToken(),
                entity.getExpiresAt());
    }
}
