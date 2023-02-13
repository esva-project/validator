import React, { Component } from "react";

import { AppBar, Tabs, Tab, Collapse, IconButton, Icon, CircularProgress, Button, Tooltip } from "@mui/material";

import SimpleReport from "./SimpleReport";
import DiagnosticTree from "./DiagnosticTree";
import ETSIValidationReport from "./ETSIValidationReport";
import DetailedReport from "./DetailedReport";

import dictionary from "./index.dictionary.json";

export default class MyFullReport extends Component {
	state = {
		selectedTab: 0,
		downloadingSimpleReport: false,
		downloadingFullReport: false,
	};

	idTabMap = {
		0: "SimpleReporte",
		1: "DetailedReport",
		2: "DiagnosticTree",
		3: "ETSIValidationReport",
	};

	downloadSimpleReportXML = (event) => {
		event.stopPropagation();
		const { simpleReportXML } = this.props.reports;
		const data = new Blob([simpleReportXML], { type: "xml/html" });
		const downloadLink = document.createElement("a");
		downloadLink.href = window.URL.createObjectURL(data);
		downloadLink.download = "simpleReport.xml";
		downloadLink.click();
	};

	downloadSimpleReportPDF = async (event) => {
		event.stopPropagation();
		this.setState({ downloadingSimpleReport: true });
		const reports = this.props.reports.simpleReportPDF ? this.props.reports : await this.props.onGetReports({ resources: ["simpleReportPDF"] });
		this.setState({ downloadingSimpleReport: false });
		if (reports && reports.simpleReportPDF) {
			const { simpleReportPDF } = reports;
			const downloadLink = document.createElement("a");
			downloadLink.href = `data:application/pdf;base64,${simpleReportPDF}`;
			downloadLink.download = "simpleReport.pdf";
			downloadLink.click();
		}
	};

	downloadDetailedReportXML = (event) => {
		event.stopPropagation();
		const { detailedReportXML } = this.props.reports;
		const data = new Blob([detailedReportXML], { type: "xml/html" });
		const downloadLink = document.createElement("a");
		downloadLink.href = window.URL.createObjectURL(data);
		downloadLink.download = "detailedReport.xml";
		downloadLink.click();
	};

	downloadDetailedReportPDF = async (event) => {
		event.stopPropagation();
		this.setState({ downloadingFullReport: true });
		const reports = this.props.reports.detailedReportPDF ? this.props.reports : await this.props.onGetReports({ resources: ["detailedReportPDF"] });
		this.setState({ downloadingFullReport: false });
		if (reports && reports.detailedReportPDF) {
			const { detailedReportPDF } = this.props.reports;
			const downloadLink = document.createElement("a");
			downloadLink.href = `data:application/pdf;base64,${detailedReportPDF}`;
			downloadLink.download = "detailedReport.pdf";
			downloadLink.click();
		}
	};

	downloadDiagnosticDataXML = (event) => {
		event.stopPropagation();
		const { diagnosticDataXML } = this.props.reports;
		const data = new Blob([diagnosticDataXML], { type: "xml/html" });
		const downloadLink = document.createElement("a");
		downloadLink.href = window.URL.createObjectURL(data);
		downloadLink.download = "diagnosticData.xml";
		downloadLink.click();
	};

	downloadValidationReportXML = (event) => {
		event.stopPropagation();
		const { validationReportXML } = this.props.reports;
		const data = new Blob([validationReportXML], { type: "xml/html" });
		const downloadLink = document.createElement("a");
		downloadLink.href = window.URL.createObjectURL(data);
		downloadLink.download = "validationReport.xml";
		downloadLink.click();
	};

	render() {
		const { selectedTab, downloadingSimpleReport, downloadingFullReport } = this.state;
		const { reports, loadingFull, errorFull, language } = this.props;
		if (loadingFull) {
			return (
				<div className="w-100 h-100 d-flex justify-content-center align-items-center">
					<CircularProgress />
				</div>
			);
		}
		if (errorFull) {
			return (
				<div className="w-100 h-100 d-flex justify-content-center align-items-center">
					<Icon className="text-danger" fontSize="large">
						close
					</Icon>
				</div>
			);
		}
		return (
			<div className="w-100 h-100">
				<AppBar className="flex-grow-1" position="static" color="default">
					<div className="w-100 d-flex">
						<Tabs value={selectedTab} variant="scrollable" indicatorColor="primary" textColor="primary" className="flex-grow-1" onChange={(event, selectedTab) => this.setState({ selectedTab })}>
							<Tab
								value={0}
								label={
									<div className="d-flex flex-nowrap align-items-center">
										<div className="flex-grow-1 me-3">{dictionary.simpleReport[language]}</div>
										<Tooltip title={dictionary.downlaodXml[language]}>
											<IconButton size="small" onClick={this.downloadSimpleReportXML}>
												<Icon>save</Icon>
											</IconButton>
										</Tooltip>
										{downloadingSimpleReport ? (
											<CircularProgress size={24} />
										) : (
											<Tooltip title={dictionary.downlaodPdf[language]}>
												<IconButton size="small" onClick={this.downloadSimpleReportPDF}>
													<Icon>assignment</Icon>
												</IconButton>
											</Tooltip>
										)}
									</div>
								}
							/>
							<Tab
								value={1}
								label={
									<div className="d-flex flex-nowrap align-items-center">
										<div className="flex-grow-1 me-3">{dictionary.detailedReport[language]}</div>
										<Tooltip title={dictionary.downlaodXml[language]}>
											<IconButton size="small" onClick={this.downloadDetailedReportXML}>
												<Icon>save</Icon>
											</IconButton>
										</Tooltip>
										{downloadingFullReport ? (
											<CircularProgress size={24} />
										) : (
											<Tooltip title={dictionary.downlaodPdf[language]}>
												<IconButton size="small" onClick={this.downloadDetailedReportPDF}>
													<Icon>assignment</Icon>
												</IconButton>
											</Tooltip>
										)}
									</div>
								}
							/>
							<Tab
								value={2}
								label={
									<div className="d-flex flex-nowrap align-items-center">
										<div className="flex-grow-1 me-3">{dictionary.diagnosisTree[language]}</div>
										<Tooltip title={dictionary.downlaodXml[language]}>
											<IconButton size="small" onClick={this.downloadDiagnosticDataXML}>
												<Icon>save</Icon>
											</IconButton>
										</Tooltip>
									</div>
								}
							/>
							<Tab
								value={3}
								label={
									<div className="d-flex flex-nowrap align-items-center">
										<div className="flex-grow-1 me-3">{dictionary.etsiValidationReport[language]}</div>
										<Tooltip title={dictionary.downlaodXml[language]}>
											<IconButton size="small" onClick={this.downloadValidationReportXML}>
												<Icon>save</Icon>
											</IconButton>
										</Tooltip>
									</div>
								}
							/>
						</Tabs>
						<div className="d-flex justify-content-center align-items-center px-2">
							<Button variant="contained" color="primary" onClick={this.props.onClose}>
								{dictionary.close[language]}
							</Button>
						</div>
					</div>
				</AppBar>
				<div className="w-100 d-flex" style={{ height: "calc(100% - 58px)" }}>
					<Collapse in={selectedTab === 0} unmountOnExit orientation="horizontal">
						<div className="h-100" style={{ width: "calc(100vw - 24px - 24px)", overflowY: "auto", transition: "all 460ms cubic-bezier(0.4, 0, 0.6, 1) 0ms" }}>
							<SimpleReport reports={reports} />
						</div>
					</Collapse>
					<Collapse in={selectedTab === 1} unmountOnExit orientation="horizontal">
						<div className="h-100" style={{ width: "calc(100vw - 24px - 24px)", overflowY: "auto", transition: "all 460ms cubic-bezier(0.4, 0, 0.6, 1) 0ms" }}>
							<DetailedReport reports={reports} />
						</div>
					</Collapse>
					<Collapse in={selectedTab === 2} unmountOnExit orientation="horizontal">
						<div className="h-100" style={{ width: "calc(100vw - 24px - 24px)", overflowY: "auto", transition: "all 460ms cubic-bezier(0.4, 0, 0.6, 1) 0ms" }}>
							<DiagnosticTree reports={reports} />
						</div>
					</Collapse>
					<Collapse in={selectedTab === 3} unmountOnExit orientation="horizontal">
						<div className="h-100" style={{ width: "calc(100vw - 24px - 24px)", overflowY: "auto", transition: "all 460ms cubic-bezier(0.4, 0, 0.6, 1) 0ms" }}>
							<ETSIValidationReport reports={reports} />
						</div>
					</Collapse>
				</div>
			</div>
		);
	}
}
