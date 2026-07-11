package ma.iam.user.web.request;

import jakarta.validation.constraints.NotNull;

public record ChangeUserStatusRequest(@NotNull Boolean enabled) {
}
