FROM openjdk:17.0.1-jdk-slim

WORKDIR /app

COPY gradlew .
COPY gradle gradle

RUN chmod -R +x ./gradlew

COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY src src

RUN ./gradlew build

CMD ["java", "-jar", "build/libs/app-server-0.0.1-SNAPSHOT.jar"]