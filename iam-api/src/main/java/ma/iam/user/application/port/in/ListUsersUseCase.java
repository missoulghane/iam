package ma.iam.user.application.port.in;

import ma.iam.shared.domain.pagination.Page;
import ma.iam.user.application.dto.UserView;
import ma.iam.user.application.query.ListUsersQuery;

public interface ListUsersUseCase {

    Page<UserView> listUsers(ListUsersQuery query);
}
