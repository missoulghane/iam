package ma.iam.user.web.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import ma.iam.shared.domain.valueobject.RawPassword;

public record RegisterUserRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = RawPassword.MIN_LENGTH) String password,
        @NotBlank String firstName,
        @NotBlank String lastName) {
}
