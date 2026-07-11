package ma.iam.user.infrastructure.mapper;

import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;

import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.HashedPassword;
import ma.iam.user.domain.model.Role;
import ma.iam.user.domain.model.User;
import ma.iam.user.domain.valueobject.UserId;
import ma.iam.user.infrastructure.persistence.UserEntity;

/**
 * Domain <-> entity mapping. Implemented as default methods rather than
 * auto-generated field mapping since the domain side is composed of value objects
 * (EmailVO, HashedPassword, UserId) that need explicit unwrapping.
 */
@Mapper(componentModel = "spring")
public interface UserPersistenceMapper {

    default UserEntity toEntity(User user) {
        return toEntity(user, new UserEntity());
    }

    /**
     * Populates an existing (possibly already-managed) entity instance rather than
     * always allocating a new one, so that repository adapters can update in place:
     * a freshly-allocated entity has a null @Version, which Spring Data JPA reads as
     * "new" and would attempt an INSERT instead of an UPDATE for an already-persisted
     * aggregate.
     */
    default UserEntity toEntity(User user, UserEntity entity) {
        entity.setId(user.getId().asUuid());
        entity.setEmail(user.getEmail().value());
        entity.setPasswordHash(user.getPassword().value());
        entity.setFirstName(user.getFirstName());
        entity.setLastName(user.getLastName());
        entity.setRoles(user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));
        entity.setVerified(user.isVerified());
        entity.setEnabled(user.isEnabled());
        return entity;
    }

    default User toDomain(UserEntity entity) {
        Set<Role> roles = entity.getRoles().stream().map(Role::valueOf).collect(Collectors.toSet());
        return User.reconstruct(
                UserId.of(entity.getId()),
                EmailVO.of(entity.getEmail()),
                HashedPassword.of(entity.getPasswordHash()),
                entity.getFirstName(),
                entity.getLastName(),
                roles,
                entity.isVerified(),
                entity.isEnabled());
    }
}
