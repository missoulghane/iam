package ma.iam.user.domain.exception;

import ma.iam.shared.exception.BusinessException;

public class AccountAlreadyVerifiedException extends BusinessException {

    public AccountAlreadyVerifiedException() {
        super("Account is already activated");
    }
}
