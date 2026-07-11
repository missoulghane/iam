package ma.iam.user.domain.exception;

import ma.iam.shared.exception.ResourceNotFoundException;
import ma.iam.user.domain.valueobject.UserId;

public class UserNotFoundException extends ResourceNotFoundException {

    public UserNotFoundException(UserId id) {
        super("User not found with id: " + id);
    }

    public UserNotFoundException(String message) {
        super(message);
    }
}
