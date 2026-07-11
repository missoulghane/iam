package ma.iam.user.domain.exception;

import ma.iam.shared.exception.BusinessException;

public class InvalidCurrentPasswordException extends BusinessException {

    public InvalidCurrentPasswordException() {
        super("The current password provided is incorrect");
    }
}
