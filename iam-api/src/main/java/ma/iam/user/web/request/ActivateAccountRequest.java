package ma.iam.user.web.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import ma.iam.shared.domain.valueobject.RawPassword;

public record ActivateAccountRequest(
        @NotBlank String token,
        @NotBlank @Size(min = RawPassword.MIN_LENGTH) String newPassword) {
}
