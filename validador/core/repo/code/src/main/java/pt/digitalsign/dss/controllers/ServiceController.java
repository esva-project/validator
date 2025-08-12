package pt.digitalsign.dss.controllers;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

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

    @RequestMapping(value = "/api/v1/user", method = RequestMethod.GET)
    public Map<String, String> getUserInfo(HttpServletRequest request) {
        Map<String, String> userInfo = new HashMap<>();

        String mail = request.getHeader("mail");
        String nmec = request.getHeader("nmec");

        userInfo.put("mail", mail != null ? mail : "");
        userInfo.put("nmec", nmec != null ? nmec : "");

        return userInfo;
    }
}
