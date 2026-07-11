package ma.iam.auth.application.dto;

import java.util.Set;

import ma.iam.shared.domain.valueobject.EntityId;

public record AuthenticatedPrincipal(EntityId userId, Set<String> authorities) {
}
