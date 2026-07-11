package ma.iam.user.application.query;

import ma.iam.shared.domain.pagination.PageRequest;
import ma.iam.user.domain.valueobject.UserSearchCriteria;

public record ListUsersQuery(PageRequest pageRequest, UserSearchCriteria criteria) {
}
