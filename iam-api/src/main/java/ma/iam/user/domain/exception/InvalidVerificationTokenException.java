package ma.iam.user.domain.exception;

import ma.iam.shared.exception.BusinessException;

public class InvalidVerificationTokenException extends BusinessException {

    public InvalidVerificationTokenException(String message) {
        super(message);
    }
}
