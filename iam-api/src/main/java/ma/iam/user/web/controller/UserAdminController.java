package ma.iam.user.web.controller;

import java.net.URI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import ma.iam.shared.domain.pagination.PageRequest;
import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.user.application.command.ChangeUserStatusCommand;
import ma.iam.user.application.command.CreateUserCommand;
import ma.iam.user.application.command.DeleteUserCommand;
import ma.iam.user.application.command.ResendAccountActivationCommand;
import ma.iam.user.application.command.UpdateUserProfileCommand;
import ma.iam.user.application.port.in.ChangeUserStatusUseCase;
import ma.iam.user.application.port.in.CreateUserUseCase;
import ma.iam.user.application.port.in.DeleteUserUseCase;
import ma.iam.user.application.port.in.GetUserUseCase;
import ma.iam.user.application.port.in.ListUsersUseCase;
import ma.iam.user.application.port.in.ResendAccountActivationUseCase;
import ma.iam.user.application.port.in.UpdateUserProfileUseCase;
import ma.iam.user.application.query.GetUserQuery;
import ma.iam.user.application.query.ListUsersQuery;
import ma.iam.user.domain.model.Role;
import ma.iam.user.domain.valueobject.UserId;
import ma.iam.user.domain.valueobject.UserSearchCriteria;
import ma.iam.user.web.request.ChangeUserStatusRequest;
import ma.iam.user.web.request.CreateUserRequest;
import ma.iam.user.web.request.UpdateProfileRequest;
import ma.iam.user.web.response.PagedUserResponse;
import ma.iam.user.web.response.UserResponse;

/**
 * "Admin" zone: every endpoint requires ROLE_ADMIN. The target user id always
 * comes from the URL.
 */
@RestController
@RequestMapping("/users")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class UserAdminController {

    private final ListUsersUseCase listUsersUseCase;
    private final GetUserUseCase getUserUseCase;
    private final UpdateUserProfileUseCase updateUserProfileUseCase;
    private final DeleteUserUseCase deleteUserUseCase;
    private final CreateUserUseCase createUserUseCase;
    private final ChangeUserStatusUseCase changeUserStatusUseCase;
    private final ResendAccountActivationUseCase resendAccountActivationUseCase;

    public UserAdminController(ListUsersUseCase listUsersUseCase,
                                GetUserUseCase getUserUseCase,
                                UpdateUserProfileUseCase updateUserProfileUseCase,
                                DeleteUserUseCase deleteUserUseCase,
                                CreateUserUseCase createUserUseCase,
                                ChangeUserStatusUseCase changeUserStatusUseCase,
                                ResendAccountActivationUseCase resendAccountActivationUseCase) {
        this.listUsersUseCase = listUsersUseCase;
        this.getUserUseCase = getUserUseCase;
        this.updateUserProfileUseCase = updateUserProfileUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
        this.createUserUseCase = createUserUseCase;
        this.changeUserStatusUseCase = changeUserStatusUseCase;
        this.resendAccountActivationUseCase = resendAccountActivationUseCase;
    }

    @GetMapping
    public PagedUserResponse list(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "20") int size,
                                   @RequestParam(required = false) String search,
                                   @RequestParam(required = false) Role role,
                                   @RequestParam(required = false) Boolean enabled) {
        UserSearchCriteria criteria = new UserSearchCriteria(search, role, enabled);
        return PagedUserResponse.from(listUsersUseCase.listUsers(new ListUsersQuery(PageRequest.of(page, size), criteria)));
    }

    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable String id) {
        return UserResponse.from(getUserUseCase.getUser(new GetUserQuery(UserId.of(id))));
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody CreateUserRequest request) {
        UserId id = createUserUseCase.create(new CreateUserCommand(
                EmailVO.of(request.email()), request.firstName(), request.lastName()));
        return ResponseEntity.created(URI.create("/api/v1/users/" + id)).build();
    }

    @PatchMapping("/{id}/profile")
    public UserResponse updateProfile(@PathVariable String id, @Valid @RequestBody UpdateProfileRequest request) {
        UpdateUserProfileCommand command = new UpdateUserProfileCommand(UserId.of(id), request.firstName(), request.lastName());
        return UserResponse.from(updateUserProfileUseCase.updateProfile(command));
    }

    @PatchMapping("/{id}/status")
    public UserResponse changeStatus(@PathVariable String id, @Valid @RequestBody ChangeUserStatusRequest request) {
        ChangeUserStatusCommand command = new ChangeUserStatusCommand(UserId.of(id), request.enabled());
        return UserResponse.from(changeUserStatusUseCase.changeStatus(command));
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        deleteUserUseCase.delete(new DeleteUserCommand(UserId.of(id)));
    }

    @ResponseStatus(HttpStatus.ACCEPTED)
    @PostMapping("/{id}/resend-activation")
    public void resendActivation(@PathVariable String id) {
        resendAccountActivationUseCase.resend(new ResendAccountActivationCommand(UserId.of(id)));
    }
}
