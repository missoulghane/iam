package ma.iam.user.web.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import ma.iam.auth.infrastructure.security.JwtService;
import ma.iam.shared.domain.pagination.Page;
import ma.iam.shared.domain.valueobject.EntityId;
import ma.iam.testsupport.WebSecuritySliceTestConfiguration;
import ma.iam.user.application.dto.UserView;
import ma.iam.user.application.port.in.ChangeUserStatusUseCase;
import ma.iam.user.application.port.in.CreateUserUseCase;
import ma.iam.user.application.port.in.DeleteUserUseCase;
import ma.iam.user.application.port.in.GetUserUseCase;
import ma.iam.user.application.port.in.ListUsersUseCase;
import ma.iam.user.application.port.in.ResendAccountActivationUseCase;
import ma.iam.user.application.port.in.UpdateUserProfileUseCase;
import ma.iam.user.domain.model.Role;
import ma.iam.user.domain.valueobject.UserId;

@WebMvcTest(controllers = UserAdminController.class)
@Import(WebSecuritySliceTestConfiguration.class)
class UserAdminControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private ListUsersUseCase listUsersUseCase;

    @MockitoBean
    private GetUserUseCase getUserUseCase;

    @MockitoBean
    private UpdateUserProfileUseCase updateUserProfileUseCase;

    @MockitoBean
    private DeleteUserUseCase deleteUserUseCase;

    @MockitoBean
    private CreateUserUseCase createUserUseCase;

    @MockitoBean
    private ChangeUserStatusUseCase changeUserStatusUseCase;

    @MockitoBean
    private ResendAccountActivationUseCase resendAccountActivationUseCase;

    private String bearerToken(String... authorities) {
        return "Bearer " + jwtService.generateAccessToken(EntityId.of(UUID.randomUUID()), Set.of(authorities));
    }

    @Test
    void anonymous_request_is_rejected_with_401() throws Exception {
        mockMvc.perform(get("/api/v1/users")).andExpect(status().isUnauthorized());
    }

    @Test
    void regular_user_is_forbidden_from_listing_users() throws Exception {
        mockMvc.perform(get("/api/v1/users").header("Authorization", bearerToken("ROLE_USER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void admin_can_list_users() throws Exception {
        when(listUsersUseCase.listUsers(any())).thenReturn(Page.of(List.of(), 0, 20, 0));

        mockMvc.perform(get("/api/v1/users").header("Authorization", bearerToken("ROLE_ADMIN")))
                .andExpect(status().isOk());
    }

    @Test
    void admin_can_get_a_user_by_id() throws Exception {
        UserId userId = UserId.newId();
        when(getUserUseCase.getUser(any())).thenReturn(
                new UserView(userId, "user@iam.ma", "Jane", "Doe", Set.of(Role.ROLE_USER), true, true));

        mockMvc.perform(get("/api/v1/users/" + userId).header("Authorization", bearerToken("ROLE_ADMIN")))
                .andExpect(status().isOk());
    }

    @Test
    void admin_can_create_a_user_returns_201_with_location_header() throws Exception {
        UserId userId = UserId.newId();
        when(createUserUseCase.create(any())).thenReturn(userId);

        mockMvc.perform(post("/api/v1/users")
                        .header("Authorization", bearerToken("ROLE_ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"new-user@iam.ma","firstName":"Jane","lastName":"Doe"}
                                """))
                .andExpect(status().isCreated());
    }

    @Test
    void regular_user_is_forbidden_from_creating_a_user() throws Exception {
        mockMvc.perform(post("/api/v1/users")
                        .header("Authorization", bearerToken("ROLE_USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"new-user@iam.ma","firstName":"Jane","lastName":"Doe"}
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    void admin_can_change_user_status() throws Exception {
        UserId userId = UserId.newId();
        when(changeUserStatusUseCase.changeStatus(any())).thenReturn(
                new UserView(userId, "user@iam.ma", "Jane", "Doe", Set.of(Role.ROLE_USER), true, false));

        mockMvc.perform(patch("/api/v1/users/" + userId + "/status")
                        .header("Authorization", bearerToken("ROLE_ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"enabled":false}
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void regular_user_is_forbidden_from_changing_user_status() throws Exception {
        mockMvc.perform(patch("/api/v1/users/" + UserId.newId() + "/status")
                        .header("Authorization", bearerToken("ROLE_USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"enabled":false}
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    void admin_can_resend_activation_email() throws Exception {
        mockMvc.perform(post("/api/v1/users/" + UserId.newId() + "/resend-activation")
                        .header("Authorization", bearerToken("ROLE_ADMIN")))
                .andExpect(status().isAccepted());
    }

    @Test
    void regular_user_is_forbidden_from_resending_activation_email() throws Exception {
        mockMvc.perform(post("/api/v1/users/" + UserId.newId() + "/resend-activation")
                        .header("Authorization", bearerToken("ROLE_USER")))
                .andExpect(status().isForbidden());
    }
}
