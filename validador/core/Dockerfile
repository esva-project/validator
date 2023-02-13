FROM  maven:3.8.4-jdk-11 AS build
WORKDIR /app/repo/code
COPY ./repo/code/pom.xml .
RUN mvn dependency:go-offline
COPY ./repo/code/src ./src
COPY ./configs src/main/resources
# RUN touch src/main/resources/application-pro.properties src/main/resources/application.properties
RUN mvn clean package -Dmaven.test.skip
RUN ls .

FROM openjdk:11-jre
WORKDIR /app/repo/code
COPY --from=build /app/repo/code/target/validador-core-1.0.jar app.jar
ENTRYPOINT cat /tmp/hosts >> /etc/hosts; java -jar app.jar