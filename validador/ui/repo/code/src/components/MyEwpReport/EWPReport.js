import { Accordion, AccordionDetails, AccordionSummary, CardContent, Collapse, Icon, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { grey, indigo, red } from "@mui/material/colors";
import React, { useState } from "react";

const EWPReport = (props) => {
	const { report } = props;
	const [selectedTab, setSelectedTab] = useState(0);

	const accordionLabels = [
		{ value: "sendingHeiValidations", label: "Sending Institution" },
		{ value: "studentValidations", label: "Student" },
		{ value: "receivingHeiValidations", label: "Receiving Institution" },
	];

	return (
		<div className="w-100">
			<Toolbar variant="dense" position="static" className="text-white" style={{ backgroundColor: indigo[400] }}>
				<Tabs value={selectedTab} variant="scrollable" indicatorColor="primay" textColor="inherit" onChange={(_, value) => setSelectedTab(value)}>
					<Tab value={0} label={"Result"} />
				</Tabs>
			</Toolbar>
			<Collapse in={true} timeout={500}>
				<CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 91.2px - 64px)" }}>
					<Typography variant="h6" className="mb-2">
						{`Found ${report.response.ewpReport.validValidations}/${report.response.ewpReport.totalValidations} matches with the Mobility found in EWP`}
					</Typography>

					{accordionLabels.map((el, index) => {
						return (
							<Accordion key={index} defaultExpanded={index === 0 ? true : false} square>
								<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" style={{ backgroundColor: grey[200] }}>
									<Typography className="fw-bold">{el.label}</Typography>
								</AccordionSummary>
								<AccordionDetails className="d-flex flex-column gap-1 justify-content-center">
									{report.response.ewpReport[el.value].map((el, index) => {
										return (
											<dl key={index} className="mb-1 d-flex flex-sm-column flex-md-row justify-content-md-between justify-content-sm-start">
												<dt className="me-1">{el.label.replace(/[{()}]/g, "")}</dt>
												<dd>{el.status === "FOUND" ? <Icon color="success">check_circle</Icon> : <Icon sx={{ color: red[600] }}>cancel</Icon>}</dd>
											</dl>
										);
									})}
								</AccordionDetails>
							</Accordion>
						);
					})}
				</CardContent>
			</Collapse>
		</div>
	);
};

export default EWPReport;
