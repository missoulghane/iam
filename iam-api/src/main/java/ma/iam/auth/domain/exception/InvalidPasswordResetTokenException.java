package ma.iam.auth.domain.exception;

import ma.iam.shared.exception.BusinessException;

public class InvalidPasswordResetTokenException extends BusinessException {

    public InvalidPasswordResetTokenException(String message) {
        super(message);
    }
}
