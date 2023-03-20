import React, { Component, Fragment } from "react";

import { Accordion, AccordionSummary, Icon, Typography, AccordionDetails, LinearProgress, IconButton, Tooltip, Button, CircularProgress, Fade } from "@mui/material";
import { red, grey, lightGreen, orange, indigo } from "@mui/material/colors";

import MySignature from "./MySignature";
import MyDialogFullReport from "./MyDialogFullReport";
import MyDialogEwpReport from "./MyDialogEwpReport";

import dictionary from "./index.dictionary.json";

export default class MyFileReport extends Component {
	state = {
		expanded: true,
		fullReportOpen: false,
		ewpReportOpen: false,
	};

	componentDidUpdate(prevProps) {
		if (prevProps.file.ewpReport !== this.props.file.ewpReport) {
			this.setState({ ewpReportOpen: true });
		}
	}

	getReports = async ({ resources }) => {
		const { file, id: fileId, name } = this.props.file;
		const reports = await this.props.onGetReports({ bytes: file.split(",")[1], fileId, name, resources });
		return reports;
	};

	render() {
		const { expanded, fullReportOpen, ewpReportOpen } = this.state;
		const { file, language } = this.props;
		const { id, name, size, loading, loadingFull, error, errorFull, success, successFull, reports, ewpReport } = file;
		const { simpleReport, certificates } = reports;
		var { validSignaturesCount, signaturesCount } = simpleReport ? simpleReport : {};
		const allRight = validSignaturesCount === signaturesCount ? 3 : validSignaturesCount === 0 ? 1 : 2;
		return (
			<Fragment>
				<Accordion expanded={!loading && success && expanded} style={{ backgroundColor: "rgba(0, 0, 0, 0)", boxShadow: "none" }} onChange={!error ? () => this.setState({ expanded: !expanded }) : null}>
					<AccordionSummary
						expandIcon={<Icon>expand_more</Icon>}
						className="rounded shadow"
						style={{
							...(loading ? { border: `4px solid ${indigo[500]}`, backgroundColor: indigo[50], borderBottom: 4 } : {}),
							...(success
								? allRight === 3
									? { border: `4px solid ${lightGreen["A700"]}`, backgroundColor: lightGreen[50] }
									: allRight === 2
									? { border: `4px solid ${orange["A200"]}`, backgroundColor: orange[50] }
									: { border: `4px solid ${red["A200"]}`, backgroundColor: red[50] }
								: {}),
							...(error ? { backgroundColor: grey[400] } : {}),
							transition: "all 0.3s",
						}}
					>
						<div className="w-100 d-flex justify-content-between align-items-center">
							<div className="d-flex align-items-center">
								<Tooltip title={dictionary.removeFile[language]}>
									<span className="me-2">
										<IconButton
											onClick={(event) => {
												event.stopPropagation();
												this.props.onDeleteFile({ id });
											}}
										>
											<Icon>delete</Icon>
										</IconButton>
									</span>
								</Tooltip>
								<Typography>{`${name} (${size})`}</Typography>
							</div>
							{success && (
								<div className="text-center">
									<Typography
										className="font-weight-bold"
										style={{ color: allRight === 3 ? lightGreen["A700"] : allRight === 2 ? orange["A400"] : red["A400"] }}
									>{`${validSignaturesCount} valid signatures out of ${signaturesCount}`}</Typography>
									<dl className="mb-0 d-flex justify-content-center flex-wrap">
										<dt className="me-1">{dictionary.validationPolicy[language]}</dt>
										<dd className="mb-0">{simpleReport.validationPolicy.policyName}</dd>
									</dl>
								</div>
							)}
							<div className="d-flex">
								<div className="mx-2 position-relative">
									<Button
										variant="outlined"
										color={file.ewpError ? "error" : file.ewpSuccess ? "success" : undefined}
										disabled={file.ewpLoading}
										onClick={(event) => (event.stopPropagation() || file.ewpSuccess ? this.setState({ ewpReportOpen: true }) : this.props.onLoadEwp({ id }))}
									>
										{dictionary.getEwp[language]}
									</Button>
									<Fade in={file.ewpLoading} mountOnEnter unmountOnExit appear timeout={500}>
										<div className="w-100 d-flex align-items-center justify-content-center" style={{ position: "absolute", top: 0, left: 0, backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
											<CircularProgress size={36.5} />
										</div>
									</Fade>
								</div>
								<Tooltip title={dictionary.openFullReport[language]}>
									<span className="mx-2">
										<IconButton onClick={(event) => event.stopPropagation() || this.setState({ fullReportOpen: true })}>
											<Icon>find_in_page</Icon>
										</IconButton>
									</span>
								</Tooltip>
							</div>
						</div>
						{loading && <LinearProgress style={{ position: "absolute", bottom: 0, left: 0, width: "100%" }} />}
					</AccordionSummary>
					{success && (
						<AccordionDetails>
							<div className="w-100">
								<div className="row">
									{simpleReport.signatureOrTimestamp.map((signature) => (
										<MySignature key={signature.id} signature={signature} certificates={certificates} language={language} />
									))}
								</div>
							</div>
						</AccordionDetails>
					)}
				</Accordion>
				<MyDialogFullReport
					open={fullReportOpen}
					reports={reports}
					loadingFull={loadingFull}
					errorFull={errorFull}
					successFull={successFull}
					language={language}
					onGetReports={this.getReports}
					onClose={() => this.setState({ fullReportOpen: false })}
				/>
				<MyDialogEwpReport open={ewpReportOpen} report={ewpReport} language={language} onClose={() => this.setState({ ewpReportOpen: false })} />
			</Fragment>
		);
	}
}
