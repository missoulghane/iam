package ma.iam.user.web.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(@NotBlank String firstName, @NotBlank String lastName) {
}
