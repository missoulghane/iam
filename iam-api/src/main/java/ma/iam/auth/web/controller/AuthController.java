package ma.iam.auth.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import ma.iam.auth.application.command.LoginCommand;
import ma.iam.auth.application.command.LogoutCommand;
import ma.iam.auth.application.command.RefreshTokenCommand;
import ma.iam.auth.application.command.RequestPasswordResetCommand;
import ma.iam.auth.application.command.ResetPasswordCommand;
import ma.iam.auth.application.dto.AuthTokens;
import ma.iam.auth.application.port.in.LoginUseCase;
import ma.iam.auth.application.port.in.LogoutUseCase;
import ma.iam.auth.application.port.in.RefreshTokenUseCase;
import ma.iam.auth.application.port.in.RequestPasswordResetUseCase;
import ma.iam.auth.application.port.in.ResetPasswordUseCase;
import ma.iam.auth.web.request.ForgotPasswordRequest;
import ma.iam.auth.web.request.LoginRequest;
import ma.iam.auth.web.request.LogoutRequest;
import ma.iam.auth.web.request.RefreshTokenRequest;
import ma.iam.auth.web.request.ResetPasswordRequest;
import ma.iam.auth.web.response.AuthResponse;
import ma.iam.shared.domain.valueobject.EmailVO;
import ma.iam.shared.domain.valueobject.RawPassword;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;
    private final LogoutUseCase logoutUseCase;
    private final RequestPasswordResetUseCase requestPasswordResetUseCase;
    private final ResetPasswordUseCase resetPasswordUseCase;

    public AuthController(LoginUseCase loginUseCase, RefreshTokenUseCase refreshTokenUseCase, LogoutUseCase logoutUseCase,
                           RequestPasswordResetUseCase requestPasswordResetUseCase, ResetPasswordUseCase resetPasswordUseCase) {
        this.loginUseCase = loginUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
        this.logoutUseCase = logoutUseCase;
        this.requestPasswordResetUseCase = requestPasswordResetUseCase;
        this.resetPasswordUseCase = resetPasswordUseCase;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        AuthTokens tokens = loginUseCase.login(new LoginCommand(EmailVO.of(request.email()), RawPassword.of(request.password())));
        return AuthResponse.from(tokens);
    }

    @PostMapping("/refresh-token")
    public AuthResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthTokens tokens = refreshTokenUseCase.refresh(new RefreshTokenCommand(request.refreshToken()));
        return AuthResponse.from(tokens);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/logout")
    public void logout(@Valid @RequestBody LogoutRequest request) {
        logoutUseCase.logout(new LogoutCommand(request.refreshToken()));
    }

    @ResponseStatus(HttpStatus.ACCEPTED)
    @PostMapping("/forgot-password")
    public void forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        requestPasswordResetUseCase.requestReset(new RequestPasswordResetCommand(EmailVO.of(request.email())));
    }

    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        resetPasswordUseCase.resetPassword(new ResetPasswordCommand(request.token(), RawPassword.of(request.newPassword())));
    }
}
