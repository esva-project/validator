package pt.digitalsign.dss.controllers;

import com.google.common.io.Resources;
import eu.europa.esig.dss.detailedreport.DetailedReportFacade;
import eu.europa.esig.dss.diagnostic.DiagnosticDataFacade;
import eu.europa.esig.dss.diagnostic.jaxb.XmlCertificate;
import eu.europa.esig.dss.model.DSSDocument;
import eu.europa.esig.dss.model.InMemoryDocument;
import eu.europa.esig.dss.pades.PAdESTimestampParameters;
import eu.europa.esig.dss.simplereport.SimpleReportFacade;
import eu.europa.esig.dss.validation.reports.Reports;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import pt.digitalsign.dss.operations.ValidationOperations;
import pt.digitalsign.dss.requests.MyDataToValidateDTO;
import pt.digitalsign.dss.responses.MyV1WSReportsDTO;
import pt.digitalsign.dss.responses.MyWSReportsDTO;
import pt.digitalsign.dss.services.FOPService;
import pt.digitalsign.dss.services.MyTSLLoaderJobService;

import javax.validation.Valid;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.io.Writer;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
public class ValidationController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ValidationController.class);

    @Autowired
    private ValidationOperations validationOperations;

    @Autowired
    private FOPService fopService;

    @Autowired
    private MyTSLLoaderJobService myTSLLoaderJobService;

    @Value("${static.path}")
    private String staticPath;

    @RequestMapping(value = "/api/v1/validation/document", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public MyV1WSReportsDTO v1ValidateDocument(@RequestBody @Valid MyDataToValidateDTO myDataToValidateDTO) throws Exception {
        LOGGER.info("/validateDocument");

        Reports reports = validationOperations.validateDocument(myDataToValidateDTO.getDataToValidate(), myTSLLoaderJobService.getCommonCertificateVerifier());

        List<String> resources = myDataToValidateDTO.getResources();

        MyV1WSReportsDTO myV1WSReportsDTO = new MyV1WSReportsDTO();
        MyWSReportsDTO myWSReportsDTO = new MyWSReportsDTO();

        if (resources.contains("simpleReport")) {
            myWSReportsDTO.setSimpleReport(reports.getSimpleReportJaxb());
        }
        if (resources.contains("simpleReportXML")) {
            myWSReportsDTO.setSimpleReportXML(reports.getXmlSimpleReport());
        }
        if (resources.contains("simpleReportHTML")) {
            String simpleReportHTML = SimpleReportFacade.newFacade().generateHtmlReport(reports.getSimpleReportJaxb());
            URL url = Resources.getResource("SimpleAndDetailedTemplate.html");
            String template = Resources.toString(url, StandardCharsets.UTF_8);
            String html = template.replace("{html}", simpleReportHTML);
            myWSReportsDTO.setSimpleReportHTML(html);
        }
        if (resources.contains("simpleReportPDF")) {
            ByteArrayOutputStream simpleReportPDFByteArray = new ByteArrayOutputStream();
            fopService.generateSimpleReport(reports.getXmlSimpleReport(), simpleReportPDFByteArray);
            String pdf = Base64.getEncoder().encodeToString(simpleReportPDFByteArray.toByteArray());
            myWSReportsDTO.setSimpleReportPDF(pdf);
        }

        if (resources.contains("detailedReport")) {
            myWSReportsDTO.setDetailedReport(reports.getDetailedReportJaxb());
        }
        if (resources.contains("detailedReportXML")) {
            myWSReportsDTO.setDetailedReportXML(reports.getXmlDetailedReport());
        }
        if (resources.contains("detailedReportHTML")) {
            String detailedReportHTML = DetailedReportFacade.newFacade().generateHtmlReport(reports.getDetailedReportJaxb());
            URL url = Resources.getResource("SimpleAndDetailedTemplate.html");
            String template = Resources.toString(url, StandardCharsets.UTF_8);
            String html = template.replace("{html}", detailedReportHTML);
            myWSReportsDTO.setDetailedReportHTML(html);
        }
        if (resources.contains("detailedReportPDF")) {
            ByteArrayOutputStream detailedReportPDFByteArray = new ByteArrayOutputStream();
            fopService.generateDetailedReport(reports.getXmlDetailedReport(), detailedReportPDFByteArray);
            String pdf = Base64.getEncoder().encodeToString(detailedReportPDFByteArray.toByteArray());
            myWSReportsDTO.setDetailedReportPDF(pdf);
        }

        if (resources.contains("diagnosticDataXML")) {
            myWSReportsDTO.setDiagnosticDataXML(reports.getXmlDiagnosticData());
        }
        if (resources.contains("diagnosticDataSVG")) {
            Writer writer = new StringWriter();
            DiagnosticDataFacade.newFacade().generateSVG(reports.getDiagnosticDataJaxb(), new StreamResult(writer));
            String diagnosticDataSVG = writer.toString();
            URL url = Resources.getResource("SvgTemplate.html");
            String template = Resources.toString(url, StandardCharsets.UTF_8);
            String uuid = UUID.randomUUID().toString();
            String html = template.replace("{uuid}", uuid);
            Path svgPath = Paths.get(staticPath + "/validations/svgs/" + uuid + ".svg");
            Files.createDirectories(svgPath.getParent());
            Files.write(svgPath, diagnosticDataSVG.getBytes());
            myWSReportsDTO.setDiagnosticDataSVG(html);
        }

        if (resources.contains("validationReport")) {
            myWSReportsDTO.setValidationReport(reports.getEtsiValidationReportJaxb());
        }
        if (resources.contains("validationReportXML")) {
            myWSReportsDTO.setValidationReportXML(reports.getXmlValidationReport());
        }

        if (resources.contains("certificates")) {
            List<XmlCertificate> certificates = new ArrayList<>();

            reports.getDiagnosticDataJaxb().getSignatures().forEach(xmlSignature -> {
                XmlCertificate certificate = xmlSignature.getSigningCertificate().getCertificate();
                certificate.setSigningCertificate(null);
                certificate.setCertificateChain(null);
                certificate.setRevocations(null);
                certificate.setTrustedServiceProviders(null);
                certificates.add(xmlSignature.getSigningCertificate().getCertificate());
            });
            myWSReportsDTO.setCertificates(certificates);
        }

        myV1WSReportsDTO.setDssResponse(myWSReportsDTO);

        LOGGER.info("Return MyV1WSReportsDTO response: " + myV1WSReportsDTO);

        return myV1WSReportsDTO;
    }

    @RequestMapping(value = "/api/v2/validation/document", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public MyWSReportsDTO v2ValidateDocument(@RequestBody @Valid MyDataToValidateDTO myDataToValidateDTO) throws Exception {
        LOGGER.info("/validateDocument");

        Reports reports = validationOperations.validateDocument(myDataToValidateDTO.getDataToValidate(), myTSLLoaderJobService.getCommonCertificateVerifier());

        List<String> resources = myDataToValidateDTO.getResources();

        MyWSReportsDTO myWSReportsDTO = new MyWSReportsDTO();

        if (resources.contains("simpleReport")) {
            myWSReportsDTO.setSimpleReport(reports.getSimpleReportJaxb());
        }
        if (resources.contains("simpleReportXML")) {
            myWSReportsDTO.setSimpleReportXML(reports.getXmlSimpleReport());
        }
        if (resources.contains("simpleReportHTML")) {
            String simpleReportHTML = SimpleReportFacade.newFacade().generateHtmlReport(reports.getSimpleReportJaxb());
            URL url = Resources.getResource("SimpleAndDetailedTemplate.html");
            String template = Resources.toString(url, StandardCharsets.UTF_8);
            String html = template.replace("{html}", simpleReportHTML);
            myWSReportsDTO.setSimpleReportHTML(html);
        }
        if (resources.contains("simpleReportPDF")) {
            ByteArrayOutputStream simpleReportPDFByteArray = new ByteArrayOutputStream();
            fopService.generateSimpleReport(reports.getXmlSimpleReport(), simpleReportPDFByteArray);
            String pdf = Base64.getEncoder().encodeToString(simpleReportPDFByteArray.toByteArray());
            myWSReportsDTO.setSimpleReportPDF(pdf);
        }

        if (resources.contains("detailedReport")) {
            myWSReportsDTO.setDetailedReport(reports.getDetailedReportJaxb());
        }
        if (resources.contains("detailedReportXML")) {
            myWSReportsDTO.setDetailedReportXML(reports.getXmlDetailedReport());
        }
        if (resources.contains("detailedReportHTML")) {
            String detailedReportHTML = DetailedReportFacade.newFacade().generateHtmlReport(reports.getDetailedReportJaxb());
            URL url = Resources.getResource("SimpleAndDetailedTemplate.html");
            String template = Resources.toString(url, StandardCharsets.UTF_8);
            String html = template.replace("{html}", detailedReportHTML);
            myWSReportsDTO.setDetailedReportHTML(html);
        }
        if (resources.contains("detailedReportPDF")) {
            ByteArrayOutputStream detailedReportPDFByteArray = new ByteArrayOutputStream();
            fopService.generateDetailedReport(reports.getXmlDetailedReport(), detailedReportPDFByteArray);
            String pdf = Base64.getEncoder().encodeToString(detailedReportPDFByteArray.toByteArray());
             myWSReportsDTO.setDetailedReportPDF(pdf);
        }

        if (resources.contains("diagnosticDataXML")) {
            myWSReportsDTO.setDiagnosticDataXML(reports.getXmlDiagnosticData());
        }
        if (resources.contains("diagnosticDataSVG")) {
            Writer writer = new StringWriter();
            DiagnosticDataFacade.newFacade().generateSVG(reports.getDiagnosticDataJaxb(), new StreamResult(writer));
            String diagnosticDataSVG = writer.toString();
            URL url = Resources.getResource("SvgTemplate.html");
            String template = Resources.toString(url, StandardCharsets.UTF_8);
            String uuid = UUID.randomUUID().toString();
            String html = template.replace("{uuid}", uuid);
            Path svgPath = Paths.get(staticPath + "/validations/svgs/" + uuid + ".svg");
            Files.createDirectories(svgPath.getParent());
            Files.write(svgPath, diagnosticDataSVG.getBytes());
            myWSReportsDTO.setDiagnosticDataSVG(html);
        }

        if (resources.contains("validationReport")) {
            myWSReportsDTO.setValidationReport(reports.getEtsiValidationReportJaxb());
        }
        if (resources.contains("validationReportXML")) {
            myWSReportsDTO.setValidationReportXML(reports.getXmlValidationReport());
        }

        if (resources.contains("certificates")) {
            List<XmlCertificate> certificates = new ArrayList<>();

            reports.getDiagnosticDataJaxb().getSignatures().forEach(xmlSignature -> {
                XmlCertificate certificate = xmlSignature.getSigningCertificate().getCertificate();
                certificate.setSigningCertificate(null);
                certificate.setCertificateChain(null);
                certificate.setRevocations(null);
                certificate.setTrustedServiceProviders(null);
                certificates.add(xmlSignature.getSigningCertificate().getCertificate());
            });
            myWSReportsDTO.setCertificates(certificates);
        }

        LOGGER.info("Return MyWSReportsDTO response: " + myWSReportsDTO);

        return myWSReportsDTO;
    }
}
