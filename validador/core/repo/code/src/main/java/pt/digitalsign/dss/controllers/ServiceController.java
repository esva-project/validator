package pt.digitalsign.dss.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class ServiceController {
    @RequestMapping(value = "/api/v1/healthCheck", method = RequestMethod.GET)
    public Object v1HealthCheck() {
        return null;
    }

    @RequestMapping(value = "/api/v2/healthCheck", method = RequestMethod.GET)
    public void v2HealthCheck() {
        return;
    }
}
