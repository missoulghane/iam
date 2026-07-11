# syntax=docker/dockerfile:1

########################################################################
# deps — resolve Maven dependencies (cached across builds via BuildKit)
########################################################################
FROM eclipse-temurin:21-jdk-alpine AS deps
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN --mount=type=cache,target=/root/.m2 ./mvnw -B dependency:go-offline

########################################################################
# build — compile and package the application as a fat jar
########################################################################
FROM deps AS build
COPY src/ src/
RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw -B -DskipTests package && \
    mv target/*.jar target/app.jar

########################################################################
# dev — used by docker-compose.override.yml for local development.
# Dependencies are NOT baked into this image: they are resolved into the
# "maven_cache" named volume mounted at /root/.m2 at container runtime, so
# they survive image rebuilds instead of being re-downloaded every time.
########################################################################
FROM eclipse-temurin:21-jdk-alpine AS dev
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY src/ src/
RUN chmod +x mvnw
EXPOSE 8080
ENTRYPOINT ["./mvnw", "spring-boot:run"]

########################################################################
# runtime — minimal production image, non-root user
########################################################################
FROM eclipse-temurin:21-jre-alpine AS runtime
RUN addgroup -S spring && adduser -S spring -G spring
WORKDIR /app
COPY --from=build /app/target/app.jar app.jar
USER spring:spring
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=5s --start-period=40s --retries=5 \
  CMD wget --spider -q http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
