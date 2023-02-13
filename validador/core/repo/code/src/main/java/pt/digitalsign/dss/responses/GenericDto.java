package pt.digitalsign.dss.responses;

import java.io.Serializable;

public class GenericDto implements Serializable {
    private String status;
    private int code;
    private MyWSReportsDTO dssResponse;


    public GenericDto(String status, int code, MyWSReportsDTO dssResponse) {
        this.status = status;
        this.code = code;
        this.dssResponse = dssResponse;
    }
}
