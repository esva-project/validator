package pt.digitalsign.dss.responses;

import eu.europa.esig.dss.detailedreport.jaxb.XmlDetailedReport;
import eu.europa.esig.dss.diagnostic.jaxb.XmlCertificate;
import eu.europa.esig.dss.simplereport.jaxb.XmlSimpleReport;
import eu.europa.esig.validationreport.jaxb.ValidationReportType;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import java.io.Serializable;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
public class MyV1WSReportsDTO implements Serializable {
    private int code = 200;
    private MyWSReportsDTO dssResponse;
    private String status = "Ok";

    public MyV1WSReportsDTO() {
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public MyWSReportsDTO getDssResponse() {
        return dssResponse;
    }

    public void setDssResponse(MyWSReportsDTO dssResponse) {
        this.dssResponse = dssResponse;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
