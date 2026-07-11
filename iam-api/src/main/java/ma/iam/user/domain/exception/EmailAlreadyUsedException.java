package ma.iam.user.domain.exception;

import ma.iam.shared.exception.BusinessException;

public class EmailAlreadyUsedException extends BusinessException {

    public EmailAlreadyUsedException(String email) {
        super("An account already exists with email: " + email);
    }
}
