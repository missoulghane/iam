package ma.iam.user.web.controller;

import java.net.URI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.RawPassword;
import ma.iam.user.application.command.ActivateAccountCommand;
import ma.iam.user.application.command.RegisterUserCommand;
import ma.iam.user.application.command.ResendVerificationCommand;
import ma.iam.user.application.command.VerifyAccountCommand;
import ma.iam.user.application.port.in.ActivateAccountUseCase;
import ma.iam.user.application.port.in.RegisterUserUseCase;
import ma.iam.user.application.port.in.ResendVerificationUseCase;
import ma.iam.user.application.port.in.VerifyAccountUseCase;
import ma.iam.user.domain.valueobject.UserId;
import ma.iam.user.web.request.ActivateAccountRequest;
import ma.iam.user.web.request.RegisterUserRequest;
import ma.iam.user.web.request.ResendVerificationRequest;
import ma.iam.user.web.request.VerifyAccountRequest;
import ma.iam.user.web.response.MessageResponse;

/**
 * Public endpoints: account creation and activation. No authentication required.
 */
@RestController
@RequestMapping("/users")
public class RegistrationController {

    private final RegisterUserUseCase registerUserUseCase;
    private final VerifyAccountUseCase verifyAccountUseCase;
    private final ResendVerificationUseCase resendVerificationUseCase;
    private final ActivateAccountUseCase activateAccountUseCase;

    public RegistrationController(RegisterUserUseCase registerUserUseCase,
                                   VerifyAccountUseCase verifyAccountUseCase,
                                   ResendVerificationUseCase resendVerificationUseCase,
                                   ActivateAccountUseCase activateAccountUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.verifyAccountUseCase = verifyAccountUseCase;
        this.resendVerificationUseCase = resendVerificationUseCase;
        this.activateAccountUseCase = activateAccountUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterUserRequest request) {
        RegisterUserCommand command = new RegisterUserCommand(
                EmailVO.of(request.email()),
                RawPassword.of(request.password()),
                request.firstName(),
                request.lastName());
        UserId userId = registerUserUseCase.register(command);
        return ResponseEntity.created(URI.create("/api/v1/users/" + userId)).build();
    }

    @PostMapping("/verify")
    public ResponseEntity<MessageResponse> verify(@Valid @RequestBody VerifyAccountRequest request) {
        verifyAccountUseCase.verify(new VerifyAccountCommand(request.token()));
        return ResponseEntity.ok(new MessageResponse("Account verified successfully"));
    }

    @ResponseStatus(HttpStatus.ACCEPTED)
    @PostMapping("/resend-verification")
    public void resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        resendVerificationUseCase.resend(new ResendVerificationCommand(EmailVO.of(request.email())));
    }

    @PostMapping("/activate-account")
    public ResponseEntity<MessageResponse> activateAccount(@Valid @RequestBody ActivateAccountRequest request) {
        activateAccountUseCase.activate(new ActivateAccountCommand(request.token(), RawPassword.of(request.newPassword())));
        return ResponseEntity.ok(new MessageResponse("Account activated successfully"));
    }
}
