import { Accordion, AccordionDetails, AccordionSummary, CardContent, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";

const DataSignatures = (props) => {
	const { report } = props;
	return (
		<div className="w-100">
			<CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 91.2px - 64px)" }}>
				<Typography variant="h6" className="mb-2">
					{`Found ${report.response.dataCollection.signature.length} ${report.response.dataCollection.signature.length > 1 ? "Valid Signatures" : "Valid Signature"}`}
				</Typography>
				{report.response.dataCollection.signature.map((el, i) => {
					return (
						<Accordion key={i} defaultExpanded square>
							<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" style={{ backgroundColor: grey[200] }}>
								<Typography className="fw-bold">{el.commonName}</Typography>
							</AccordionSummary>
							<AccordionDetails className="d-flex flex-column gap-1 justify-content-center">
								<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
									<dt className="me-1">Email:</dt>
									<dd className="mb-2">{el.email}</dd>
								</dl>
								<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
									<dt className="me-1">Level:</dt>
									<dd className="mb-2">{el.level}</dd>
								</dl>
								<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
									<dt className="me-1">Country:</dt>
									<dd className="mb-2">{el.country}</dd>
								</dl>
								<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
									<dt className="me-1">Organization Name:</dt>
									<dd className="mb-2">{el.organizationName}</dd>
								</dl>
							</AccordionDetails>
						</Accordion>
					);
				})}
			</CardContent>
		</div>
	);
};

export default DataSignatures;
