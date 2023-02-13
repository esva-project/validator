package pt.digitalsign.dss.services;

import eu.europa.esig.dss.alert.ExceptionOnStatusAlert;
import eu.europa.esig.dss.model.DSSException;
import eu.europa.esig.dss.pades.signature.PAdESService;
import eu.europa.esig.dss.service.crl.OnlineCRLSource;
import eu.europa.esig.dss.service.http.commons.CommonsDataLoader;
import eu.europa.esig.dss.service.http.commons.FileCacheDataLoader;
import eu.europa.esig.dss.service.ocsp.OnlineOCSPSource;
import eu.europa.esig.dss.spi.DSSUtils;
import eu.europa.esig.dss.spi.client.http.DSSFileLoader;
import eu.europa.esig.dss.spi.client.http.IgnoreDataLoader;
import eu.europa.esig.dss.spi.tsl.TrustedListsCertificateSource;
import eu.europa.esig.dss.spi.x509.CertificateSource;
import eu.europa.esig.dss.spi.x509.CommonTrustedCertificateSource;
import eu.europa.esig.dss.spi.x509.KeyStoreCertificateSource;
import eu.europa.esig.dss.spi.x509.aia.DefaultAIASource;
import eu.europa.esig.dss.tsl.cache.CacheCleaner;
import eu.europa.esig.dss.tsl.function.OfficialJournalSchemeInformationURI;
import eu.europa.esig.dss.tsl.job.TLValidationJob;
import eu.europa.esig.dss.tsl.source.LOTLSource;
import eu.europa.esig.dss.tsl.sync.AcceptAllStrategy;
import eu.europa.esig.dss.validation.CommonCertificateVerifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Date;

@EnableScheduling
@Service
public class MyTSLLoaderJobService {
    private static final Logger LOGGER = LoggerFactory.getLogger(MyTSLLoaderJobService.class);

    private static final String KEYSTORE = "keystore.p12";

    @Value("${lotl.url}")
    private String lotlUrl;

    @Value("${lotl.oj.url}")
    private String lotlOjUrl;

    @Value("${lotl.trustedCertificatesPath}")
    private String trustedCertificatesPath;


    @Value("${static.path}")
    private String staticPath;

    @Value("${svgs.delete.period}")
    private int svgsDeletePeriod;

    private TLValidationJob job;
    private TrustedListsCertificateSource trustedListsCertificateSource;
    private CommonCertificateVerifier commonCertificateVerifier;

    @PostConstruct
    public void Init() {
        job = new TLValidationJob();
        trustedListsCertificateSource = new TrustedListsCertificateSource();

        job.setTrustedListCertificateSource(trustedListsCertificateSource);
        job.setListOfTrustedListSources(europeanLOTL());
        job.setOfflineDataLoader(offlineLoader());
        job.setOnlineDataLoader(onlineLoader());

        job.setSynchronizationStrategy(new AcceptAllStrategy());
        job.setCacheCleaner(cacheCleaner());

        commonCertificateVerifier = new CommonCertificateVerifier();
        commonCertificateVerifier.setCrlSource(new OnlineCRLSource());
        commonCertificateVerifier.setOcspSource(new OnlineOCSPSource());
        commonCertificateVerifier.setAIASource(new DefaultAIASource());
        commonCertificateVerifier.setAlertOnMissingRevocationData(new ExceptionOnStatusAlert());
        commonCertificateVerifier.setCheckRevocationForUntrustedChains(false);
    }

    @Scheduled(fixedDelayString = "${svgs.delete.period}")
    public void deleteSvgs() throws MalformedURLException {
        for (final File file : new File(staticPath + "/validations/svgs").listFiles()) {
            long diff = new Date().getTime() - file.lastModified();
            if (diff > svgsDeletePeriod) {
                file.delete();
            }
        }
    }

    @Scheduled(fixedDelayString = "${lotl.cron.period}")
    public void refresh() throws MalformedURLException {
        commonCertificateVerifier.setTrustedCertSources(getTrustedListsCertificateSource());
        CommonTrustedCertificateSource commonTrustedCertificateSource = new CommonTrustedCertificateSource();
        for (final File file : new File(trustedCertificatesPath).listFiles()) {
            if (file.isFile()) {
                commonTrustedCertificateSource.addCertificate(DSSUtils.loadCertificate(file));
                LOGGER.info(file.getName());
            }
        }
        commonCertificateVerifier.addTrustedCertSources(commonTrustedCertificateSource);
        job.onlineRefresh();
    }

    public TrustedListsCertificateSource getTrustedListsCertificateSource() {
        return trustedListsCertificateSource;
    }

    public CommonCertificateVerifier getCommonCertificateVerifier() {
        return commonCertificateVerifier;
    }

    public LOTLSource europeanLOTL() {
        LOTLSource lotlSource = new LOTLSource();
        lotlSource.setUrl(lotlUrl);
        lotlSource.setCertificateSource(officialJournalContentKeyStore());
        lotlSource.setSigningCertificatesAnnouncementPredicate(new OfficialJournalSchemeInformationURI(lotlOjUrl));
        lotlSource.setPivotSupport(true);
        return lotlSource;
    }

    public CertificateSource officialJournalContentKeyStore() {
        try {
            return new KeyStoreCertificateSource(new ClassPathResource(KEYSTORE).getInputStream(), "PKCS12", "dss-password");
        } catch (IOException e) {
            throw new DSSException("Unable to load the keystore", e);
        }
    }

    public DSSFileLoader offlineLoader() {
        FileCacheDataLoader offlineFileLoader = new FileCacheDataLoader();
        offlineFileLoader.setCacheExpirationTime(Long.MAX_VALUE);
        offlineFileLoader.setDataLoader(new IgnoreDataLoader());
        offlineFileLoader.setFileCacheDirectory(tlCacheDirectory());
        return offlineFileLoader;
    }

    public DSSFileLoader onlineLoader() {
        FileCacheDataLoader onlineFileLoader = new FileCacheDataLoader();
        onlineFileLoader.setCacheExpirationTime(0);
        onlineFileLoader.setDataLoader(dataLoader());
        onlineFileLoader.setFileCacheDirectory(tlCacheDirectory());
        return onlineFileLoader;
    }

    public File tlCacheDirectory() {
        File rootFolder = new File(System.getProperty("java.io.tmpdir"));
        File tslCache = new File(rootFolder, "dss-tsl-loader");
        if (tslCache.mkdirs()) {
            LOGGER.info("TL Cache folder : {}", tslCache.getAbsolutePath());
        }
        return tslCache;
    }

    public CommonsDataLoader dataLoader() {
        return new CommonsDataLoader();
    }

    public CacheCleaner cacheCleaner() {
        CacheCleaner cacheCleaner = new CacheCleaner();
        cacheCleaner.setCleanMemory(true);
        cacheCleaner.setCleanFileSystem(true);
        cacheCleaner.setDSSFileLoader(offlineLoader());
        return cacheCleaner;
    }
}
