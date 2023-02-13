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
public class MyWSReportsDTO implements Serializable {
    private XmlSimpleReport simpleReport;
    private String simpleReportXML;
    private String simpleReportHTML;
    private String simpleReportPDF;

    private XmlDetailedReport detailedReport;
    private String detailedReportXML;
    private String detailedReportHTML;
    private String detailedReportPDF;

    private String diagnosticDataXML;
    private String diagnosticDataSVG;

    private ValidationReportType validationReport;
    private String validationReportXML;

    private List<XmlCertificate> certificates;

    public MyWSReportsDTO() {
    }

    public XmlSimpleReport getSimpleReport() {
        return simpleReport;
    }

    public void setSimpleReport(XmlSimpleReport simpleReport) {
        this.simpleReport = simpleReport;
    }

    public String getSimpleReportXML() {
        return simpleReportXML;
    }

    public void setSimpleReportXML(String simpleReportXML) {
        this.simpleReportXML = simpleReportXML;
    }

    public String getSimpleReportHTML() {
        return simpleReportHTML;
    }

    public void setSimpleReportHTML(String simpleReportHTML) {
        this.simpleReportHTML = simpleReportHTML;
    }

    public String getSimpleReportPDF() {
        return simpleReportPDF;
    }

    public void setSimpleReportPDF(String simpleReportPDF) {
        this.simpleReportPDF = simpleReportPDF;
    }

    public XmlDetailedReport getDetailedReport() {
        return detailedReport;
    }

    public void setDetailedReport(XmlDetailedReport detailedReport) {
        this.detailedReport = detailedReport;
    }

    public String getDetailedReportXML() {
        return detailedReportXML;
    }

    public void setDetailedReportXML(String detailedReportXML) {
        this.detailedReportXML = detailedReportXML;
    }

    public String getDetailedReportHTML() {
        return detailedReportHTML;
    }

    public void setDetailedReportHTML(String detailedReportHTML) {
        this.detailedReportHTML = detailedReportHTML;
    }

    public String getDetailedReportPDF() {
        return detailedReportPDF;
    }

    public void setDetailedReportPDF(String detailedReportPDF) {
        this.detailedReportPDF = detailedReportPDF;
    }

    public String getDiagnosticDataXML() {
        return diagnosticDataXML;
    }

    public void setDiagnosticDataXML(String diagnosticDataXML) {
        this.diagnosticDataXML = diagnosticDataXML;
    }

    public String getDiagnosticDataSVG() {
        return diagnosticDataSVG;
    }

    public void setDiagnosticDataSVG(String diagnosticDataSVG) {
        this.diagnosticDataSVG = diagnosticDataSVG;
    }

    public ValidationReportType getValidationReport() {
        return validationReport;
    }

    public void setValidationReport(ValidationReportType validationReport) {
        this.validationReport = validationReport;
    }

    public String getValidationReportXML() {
        return validationReportXML;
    }

    public void setValidationReportXML(String validationReportXML) {
        this.validationReportXML = validationReportXML;
    }

    public List<XmlCertificate> getCertificates() {
        return certificates;
    }

    public void setCertificates(List<XmlCertificate> certificates) {
        this.certificates = certificates;
    }
}
