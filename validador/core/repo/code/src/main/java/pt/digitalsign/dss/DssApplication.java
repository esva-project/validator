package pt.digitalsign.dss;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "DigitalSign DSS", version = "1.0", description = "DigitalSign Service for validating digital signatures"))
public class DssApplication {
	public static void main(String[] args) {
		SpringApplication.run(DssApplication.class, args);
	}
}
