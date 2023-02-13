import React, { Component } from "react";

import { Card, CardContent, Collapse, FormControlLabel, Switch } from "@mui/material";
import XMLViewer from "react-xml-viewer";

export default class ETSIValidationReport extends Component {
	state = {
		rawReportExpanded: true,
		rawReportBeauty: false,
	};

	render() {
		const { validationReportXML } = this.props.reports;
		const { rawReportExpanded, rawReportBeauty } = this.state;
		return (
			<div className="w-100">
				<Card elevation={3} className="mb-3 card">
					<div className="w-100 card-header text-white d-flex justify-content-between align-items-center flex-wrap" style={{ backgroundColor: "#004494" }} onClick={() => this.setState({ rawReportExpanded: !rawReportExpanded })}>
						<span>Raw Report</span>
						<FormControlLabel
							className="m-0"
							control={<Switch size="small" checked={rawReportBeauty} onChange={(event) => this.setState({ rawReportBeauty: event.target.checked })} />}
							label="Beautify"
							labelPlacement="start"
							onClick={(event) => event.stopPropagation()}
						/>
					</div>
					<Collapse in={rawReportExpanded} timeout={500}>
						<CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 91.2px - 64px - 58px - 20px)" }}>
							{rawReportBeauty ? <XMLViewer xml={validationReportXML} indentSize={4} collapsible /> : <pre>{validationReportXML}</pre>}
						</CardContent>
					</Collapse>
				</Card>
			</div>
		);
	}
}
