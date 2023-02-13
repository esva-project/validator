import React, { Component } from "react";

import { Card, CardContent, Collapse, FormControlLabel, Switch } from "@mui/material";
import XMLViewer from "react-xml-viewer";

export default class SimpleReport extends Component {
	state = {
		iframeHeight: 0,
		rawReportExpanded: true,
		rawReportBeauty: false,
	};

	componentDidMount() {
		window.addEventListener("message", this.handleResize, false);
	}

	handleResize = ({ data: iframeHeight }) => {
		if (typeof iframeHeight === "number") {
			this.setState({ iframeHeight });
		}
	};

	render() {
		const { detailedReportXML, detailedReportHTML } = this.props.reports;
		const { iframeHeight, rawReportExpanded, rawReportBeauty } = this.state;
		return (
			<div className="w-100">
				<iframe frameBorder="0" className="w-100 mb-2" style={{ height: iframeHeight }} srcDoc={detailedReportHTML} title="DetailedReport"></iframe>
				{iframeHeight ? (
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
								{rawReportBeauty ? <XMLViewer xml={detailedReportXML} indentSize={4} collapsible /> : <pre>{detailedReportXML}</pre>}
							</CardContent>
						</Collapse>
					</Card>
				) : null}
			</div>
		);
	}
}
