package ma.iam.user.web.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import ma.iam.user.application.port.in.ActivateAccountUseCase;
import ma.iam.user.application.port.in.RegisterUserUseCase;
import ma.iam.user.application.port.in.ResendVerificationUseCase;
import ma.iam.user.application.port.in.VerifyAccountUseCase;
import ma.iam.user.domain.exception.InvalidVerificationTokenException;
import ma.iam.user.domain.valueobject.UserId;

@WebMvcTest(controllers = RegistrationController.class)
class RegistrationControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RegisterUserUseCase registerUserUseCase;

    @MockitoBean
    private VerifyAccountUseCase verifyAccountUseCase;

    @MockitoBean
    private ResendVerificationUseCase resendVerificationUseCase;

    @MockitoBean
    private ActivateAccountUseCase activateAccountUseCase;

    @Test
    void register_with_valid_body_returns_201_with_location() throws Exception {
        UserId userId = UserId.newId();
        when(registerUserUseCase.register(any())).thenReturn(userId);

        mockMvc.perform(post("/api/v1/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"user@iam.ma","password":"password123","firstName":"Jane","lastName":"Doe"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/v1/users/" + userId));
    }

    @Test
    void register_with_invalid_email_returns_400() throws Exception {
        mockMvc.perform(post("/api/v1/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"not-an-email","password":"password123","firstName":"Jane","lastName":"Doe"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_with_short_password_returns_400() throws Exception {
        mockMvc.perform(post("/api/v1/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"user@iam.ma","password":"short","firstName":"Jane","lastName":"Doe"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void verify_with_valid_token_returns_200() throws Exception {
        mockMvc.perform(post("/api/v1/users/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"token":"some-token"}
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void verify_with_invalid_token_returns_400() throws Exception {
        org.mockito.Mockito.doThrow(new InvalidVerificationTokenException("bad token"))
                .when(verifyAccountUseCase).verify(any());

        mockMvc.perform(post("/api/v1/users/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"token":"bad-token"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void resend_verification_always_returns_202() throws Exception {
        mockMvc.perform(post("/api/v1/users/resend-verification")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"unknown@iam.ma"}
                                """))
                .andExpect(status().isAccepted());
    }

    @Test
    void activate_account_with_valid_token_and_password_returns_200() throws Exception {
        mockMvc.perform(post("/api/v1/users/activate-account")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"token":"some-token","newPassword":"password123"}
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void activate_account_with_invalid_token_returns_400() throws Exception {
        org.mockito.Mockito.doThrow(new InvalidVerificationTokenException("bad token"))
                .when(activateAccountUseCase).activate(any());

        mockMvc.perform(post("/api/v1/users/activate-account")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"token":"bad-token","newPassword":"password123"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void activate_account_with_short_password_returns_400() throws Exception {
        mockMvc.perform(post("/api/v1/users/activate-account")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"token":"some-token","newPassword":"short"}
                                """))
                .andExpect(status().isBadRequest());
    }
}
