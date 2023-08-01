DROP TABLE IF EXISTS logs;
CREATE TABLE logs (
    time VARCHAR DEFAULT NOW(),
    ip VARCHAR,
    receivingEndpoint VARCHAR,
    receivingParameters VARCHAR,
    requestsPerformed VARCHAR [],
    responseStatus SMALLINT,
    responseMessage VARCHAR
);
