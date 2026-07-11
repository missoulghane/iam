package ma.iam.user.web.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import ma.iam.shared.domain.valueobject.RawPassword;
import ma.iam.user.application.command.ChangePasswordCommand;
import ma.iam.user.application.command.UpdateUserProfileCommand;
import ma.iam.user.application.dto.UserView;
import ma.iam.user.application.port.in.ChangePasswordUseCase;
import ma.iam.user.application.port.in.GetUserUseCase;
import ma.iam.user.application.port.in.UpdateUserProfileUseCase;
import ma.iam.user.application.query.GetUserQuery;
import ma.iam.user.domain.valueobject.UserId;
import ma.iam.user.web.request.ChangePasswordRequest;
import ma.iam.user.web.request.UpdateProfileRequest;
import ma.iam.user.web.response.UserResponse;

/**
 * "Self" zone: the acting user's id is always taken from the authenticated
 * principal (JWT subject), never from the URL.
 */
@RestController
@RequestMapping("/users/me")
public class UserMeController {

    private final GetUserUseCase getUserUseCase;
    private final UpdateUserProfileUseCase updateUserProfileUseCase;
    private final ChangePasswordUseCase changePasswordUseCase;

    public UserMeController(GetUserUseCase getUserUseCase,
                             UpdateUserProfileUseCase updateUserProfileUseCase,
                             ChangePasswordUseCase changePasswordUseCase) {
        this.getUserUseCase = getUserUseCase;
        this.updateUserProfileUseCase = updateUserProfileUseCase;
        this.changePasswordUseCase = changePasswordUseCase;
    }

    @GetMapping
    public UserResponse me(Authentication authentication) {
        UserView view = getUserUseCase.getUser(new GetUserQuery(currentUserId(authentication)));
        return UserResponse.from(view);
    }

    @PatchMapping("/profile")
    public UserResponse updateProfile(Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        UpdateUserProfileCommand command = new UpdateUserProfileCommand(
                currentUserId(authentication), request.firstName(), request.lastName());
        return UserResponse.from(updateUserProfileUseCase.updateProfile(command));
    }

    @PatchMapping("/password")
    public void changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        ChangePasswordCommand command = new ChangePasswordCommand(
                currentUserId(authentication),
                RawPassword.of(request.currentPassword()),
                RawPassword.of(request.newPassword()));
        changePasswordUseCase.changePassword(command);
    }

    private UserId currentUserId(Authentication authentication) {
        return UserId.of(authentication.getName());
    }
}
