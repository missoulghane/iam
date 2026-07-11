package ma.iam.user.infrastructure.adapter;

import java.util.Optional;

import org.springframework.stereotype.Component;

import ma.iam.user.domain.model.VerificationToken;
import ma.iam.user.domain.repository.VerificationTokenRepository;
import ma.iam.user.domain.valueobject.UserId;
import ma.iam.user.domain.valueobject.VerificationTokenId;
import ma.iam.user.infrastructure.persistence.VerificationTokenEntity;
import ma.iam.user.infrastructure.persistence.VerificationTokenJpaRepository;

@Component
public class VerificationTokenRepositoryAdapter implements VerificationTokenRepository {

    private final VerificationTokenJpaRepository jpaRepository;

    public VerificationTokenRepositoryAdapter(VerificationTokenJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public VerificationToken save(VerificationToken token) {
        VerificationTokenEntity entity = new VerificationTokenEntity();
        entity.setId(token.id().asUuid());
        entity.setUserId(token.userId().asUuid());
        entity.setToken(token.token());
        entity.setExpiresAt(token.expiresAt());
        VerificationTokenEntity saved = jpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<VerificationToken> findByToken(String tokenValue) {
        return jpaRepository.findByToken(tokenValue).map(this::toDomain);
    }

    @Override
    public void deleteByUserId(UserId userId) {
        jpaRepository.deleteByUserId(userId.asUuid());
    }

    private VerificationToken toDomain(VerificationTokenEntity entity) {
        return new VerificationToken(
                VerificationTokenId.of(entity.getId()),
                UserId.of(entity.getUserId()),
                entity.getToken(),
                entity.getExpiresAt());
    }
}
