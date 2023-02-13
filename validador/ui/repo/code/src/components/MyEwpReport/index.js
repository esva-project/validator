import React, { Component } from "react";

import { IconButton, Icon, DialogTitle, DialogContent, Typography, Divider } from "@mui/material";
import ReactJson from "react-json-view";

import { indigo } from "@mui/material/colors";

export default class MyEwpReport extends Component {
	render() {
		const { report, language } = this.props;
		return (
			<>
				<DialogTitle className="text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: indigo[500] }}>
					<span>EWP Report</span>
					<IconButton color="inherit" onClick={this.props.onClose}>
						<Icon>close</Icon>
					</IconButton>
				</DialogTitle>
				<DialogContent className="h-100 d-flex px-0">
					<div style={{ maxWidth: 400, minWidth: 200, overflow: "overlay" }}>
						{report.logs.map((log, index) => (
							<div key={index} className={`py-2 px-1 text-bg-${log.split(": ")[0].toLowerCase().replace("error", "danger")}`}>
								<Typography>{log}</Typography>
							</div>
						))}
					</div>
					<div className="flex-grow-1 h-100 d-flex flex-column">
						<div className="w-100 text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
							<Typography variant="h5">{`${report.validationResult} - ${report.message}`}</Typography>
						</div>
						<Divider />
						<div className="w-100 flex-grow-1 p-2" style={{ overflow: "overlay" }}>
							<ReactJson src={report.validations} name={null} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
						</div>
					</div>
				</DialogContent>
			</>
		);
	}
}
