package ma.iam.user.web.response;

import java.util.List;

import ma.iam.shared.domain.pagination.Page;
import ma.iam.user.application.dto.UserView;

public record PagedUserResponse(List<UserResponse> content, int pageNumber, int pageSize, long totalElements,
                                 int totalPages) {

    public static PagedUserResponse from(Page<UserView> page) {
        List<UserResponse> content = page.content().stream().map(UserResponse::from).toList();
        return new PagedUserResponse(content, page.pageNumber(), page.pageSize(), page.totalElements(), page.totalPages());
    }
}
