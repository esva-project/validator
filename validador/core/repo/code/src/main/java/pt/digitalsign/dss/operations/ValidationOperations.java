package pt.digitalsign.dss.operations;

import eu.europa.esig.dss.model.DSSDocument;
import eu.europa.esig.dss.model.DSSException;
import eu.europa.esig.dss.policy.ValidationPolicy;
import eu.europa.esig.dss.policy.ValidationPolicyFacade;
import eu.europa.esig.dss.utils.Utils;
import eu.europa.esig.dss.validation.CommonCertificateVerifier;
import eu.europa.esig.dss.validation.SignedDocumentValidator;
import eu.europa.esig.dss.validation.UserFriendlyIdentifierProvider;
import eu.europa.esig.dss.validation.reports.Reports;
import eu.europa.esig.dss.ws.converter.RemoteDocumentConverter;
import eu.europa.esig.dss.ws.dto.RemoteDocument;
import eu.europa.esig.dss.ws.validation.dto.DataToValidateDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.io.ByteArrayInputStream;
import java.util.Locale;
import pt.digitalsign.dss.controllers.ValidationController;


@Service
public class ValidationOperations {
    private static final Logger LOGGER = LoggerFactory.getLogger(ValidationController.class);

    public Reports validateDocument(DataToValidateDTO dataToValidate, CommonCertificateVerifier commonCertificateVerifier) throws Exception {
        LOGGER.info("ValidateDocument in process...");

        DSSDocument dssDocument = RemoteDocumentConverter.toDSSDocument(dataToValidate.getSignedDocument());
        SignedDocumentValidator signedDocumentValidator = SignedDocumentValidator.fromDocument(dssDocument);

        if (dataToValidate.getTokenExtractionStrategy() != null) {
            signedDocumentValidator.setTokenExtractionStrategy(dataToValidate.getTokenExtractionStrategy());
        }

        if (Utils.isCollectionNotEmpty(dataToValidate.getOriginalDocuments())) {
            signedDocumentValidator.setDetachedContents(RemoteDocumentConverter.toDSSDocuments(dataToValidate.getOriginalDocuments()));
        }

        signedDocumentValidator.setTokenIdentifierProvider(new UserFriendlyIdentifierProvider());

        signedDocumentValidator.setLocale(Locale.getDefault());

        signedDocumentValidator.setCertificateVerifier(commonCertificateVerifier);

        Reports reports;
        RemoteDocument policy = dataToValidate.getPolicy();
        if (policy == null) {
            reports = signedDocumentValidator.validateDocument();
        } else {
            reports = signedDocumentValidator.validateDocument(getValidationPolicy(policy));
        }

        LOGGER.info("ValidateDocument is finished");

        return reports;

    }

    private ValidationPolicy getValidationPolicy(RemoteDocument policy) {
        try {
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(policy.getBytes());

            ValidationPolicy var3;
            try {
                var3 = ValidationPolicyFacade.newFacade().getValidationPolicy(byteArrayInputStream);
            } catch (Throwable var6) {
                try {
                    byteArrayInputStream.close();
                } catch (Throwable var5) {
                    var6.addSuppressed(var5);
                }

                throw var6;
            }

            byteArrayInputStream.close();
            return var3;
        } catch (Exception var7) {
            throw new DSSException("Unable to load the validation policy", var7);
        }
    }
}
