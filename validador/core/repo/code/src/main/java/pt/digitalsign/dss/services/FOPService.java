package pt.digitalsign.dss.services;

import eu.europa.esig.dss.detailedreport.DetailedReportFacade;
import eu.europa.esig.dss.simplereport.SimpleReportFacade;
import org.apache.commons.io.FilenameUtils;
import org.apache.fop.apps.*;
import org.apache.fop.configuration.Configuration;
import org.apache.fop.configuration.ConfigurationException;
import org.apache.fop.configuration.DefaultConfigurationBuilder;
import org.apache.xmlgraphics.io.Resource;
import org.apache.xmlgraphics.io.ResourceResolver;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import javax.xml.transform.Result;
import javax.xml.transform.sax.SAXResult;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.util.Objects;


@Component
public class FOPService {

    private static final String FOP_CONFIG = "fop.xconf";

    private final FopFactory fopFactory;
    private final FOUserAgent foUserAgent;

    public FOPService() throws IOException, ConfigurationException {

        FopFactoryBuilder builder = new FopFactoryBuilder(new File(".").toURI(), new ClasspathResolver());
        builder.setAccessibility(true);

        try (InputStream is = new ClassPathResource(FOP_CONFIG).getInputStream()) {
            DefaultConfigurationBuilder configurationBuilder = new DefaultConfigurationBuilder();
            Configuration configuration = configurationBuilder.build(is);
            builder.setConfiguration(configuration);
        }

        fopFactory = builder.build();

        foUserAgent = fopFactory.newFOUserAgent();
        foUserAgent.setCreator("DSS Webapp");
        foUserAgent.setAccessibility(true);

    }

    public void generateSimpleReport(String simpleReport, OutputStream os) throws Exception {
        Fop fop = fopFactory.newFop(MimeConstants.MIME_PDF, foUserAgent, os);
        Result result = new SAXResult(fop.getDefaultHandler());
        SimpleReportFacade.newFacade().generatePdfReport(simpleReport, result);
    }

    public void generateDetailedReport(String detailedReport, OutputStream os) throws Exception {
        Fop fop = fopFactory.newFop(MimeConstants.MIME_PDF, foUserAgent, os);
        Result result = new SAXResult(fop.getDefaultHandler());
        DetailedReportFacade.newFacade().generatePdfReport(detailedReport, result);
    }

    private static class ClasspathResolver implements ResourceResolver {

        @Override
        public Resource getResource(URI uri) {
            return new Resource(FOPService.class.getResourceAsStream("/fonts/" + FilenameUtils.getName(uri.toString())));
        }

        @Override
        public OutputStream getOutputStream(URI uri) throws IOException {
            return Objects.requireNonNull(Thread.currentThread().getContextClassLoader().getResource(uri.toString())).openConnection()
                    .getOutputStream();
        }

    }

}
