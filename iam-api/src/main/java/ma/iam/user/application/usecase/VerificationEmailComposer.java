package ma.iam.user.application.usecase;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Composes the subject/body of the account-verification email. Package-private:
 * only used internally by RegisterUserService and ResendVerificationService.
 */
@Component
class VerificationEmailComposer {

    private final String verificationBaseUrl;

    VerificationEmailComposer(@Value("${iam.mail.verification-base-url}") String verificationBaseUrl) {
        this.verificationBaseUrl = verificationBaseUrl;
    }

    String subject() {
        return "IAM - Confirmez votre adresse email";
    }

    String htmlBody(String token) {
        String link = verificationBaseUrl + "?token=" + token;
        return """
                <p>Bienvenue sur IAM,</p>
                <p>Merci de confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>
                <p><a href="%s">Confirmer mon compte</a></p>
                <p>Ce lien expire dans 24 heures.</p>
                """.formatted(link);
    }
}
