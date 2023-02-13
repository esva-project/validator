package pt.digitalsign.dss.requests;

import eu.europa.esig.dss.ws.validation.dto.DataToValidateDTO;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import java.io.Serializable;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
public class MyDataToValidateDTO implements Serializable {
    private DataToValidateDTO dataToValidate;
    private List<String> resources;


    public MyDataToValidateDTO() {
    }

    public DataToValidateDTO getDataToValidate() {
        return dataToValidate;
    }

    public void setDataToValidate(DataToValidateDTO dataToValidate) {
        this.dataToValidate = dataToValidate;
    }

    public List<String> getResources() {
        return resources;
    }

    public void setResources(List<String> resources) {
        this.resources = resources;
    }
}
