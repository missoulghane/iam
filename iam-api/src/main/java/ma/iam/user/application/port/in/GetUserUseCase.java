package ma.iam.user.application.port.in;

import ma.iam.user.application.dto.UserView;
import ma.iam.user.application.query.GetUserQuery;

public interface GetUserUseCase {

    UserView getUser(GetUserQuery query);
}
