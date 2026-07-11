package ma.iam.architecture;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.Test;

/**
 * ArchUnit operates on bytecode, but Lombok annotations use SOURCE retention and
 * leave no trace after compilation. This test enforces the "Lombok forbidden in
 * domain and application" rule (docs/ARCHITECTURE.md, rule 1) by scanning .java
 * source files directly.
 */
class LombokUsageSourceTest {

    private static final Path SOURCE_ROOT = Path.of("src", "main", "java");

    @Test
    void domain_and_application_source_files_must_not_import_lombok() throws IOException {
        List<Path> offendingFiles;
        try (var paths = Files.walk(SOURCE_ROOT)) {
            offendingFiles = paths
                    .filter(path -> path.toString().endsWith(".java"))
                    .filter(LombokUsageSourceTest::isInDomainOrApplicationLayer)
                    .filter(LombokUsageSourceTest::importsLombok)
                    .toList();
        }

        assertThat(offendingFiles)
                .as("domain/application source files must not import lombok")
                .isEmpty();
    }

    private static boolean isInDomainOrApplicationLayer(Path path) {
        String normalized = path.toString().replace('\\', '/');
        return normalized.contains("/domain/") || normalized.contains("/application/");
    }

    private static boolean importsLombok(Path path) {
        try {
            return Files.readString(path).lines().anyMatch(line -> line.trim().startsWith("import lombok."));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
