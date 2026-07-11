package ma.iam.user.domain.valueobject;

import ma.iam.user.domain.model.Role;

/**
 * Optional list-filter axes for admin user search: null means "no filter on this
 * axis".
 */
public record UserSearchCriteria(String search, Role role, Boolean enabled) {

    public static UserSearchCriteria empty() {
        return new UserSearchCriteria(null, null, null);
    }
}
