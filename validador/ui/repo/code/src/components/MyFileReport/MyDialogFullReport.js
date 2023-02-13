import React, { Component } from "react";

import { Slide, Dialog, DialogContent } from "@mui/material";
import MyFullReport from "../MyFullReport";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default class MyDialogFullReport extends Component {
	render() {
		const { open, reports, loadingFull, errorFull, successFull, language } = this.props;
		return (
			<Dialog open={open} className="p-4" fullScreen TransitionComponent={Transition} onClose={this.props.onClose}>
				<DialogContent className="p-0 overflow-hidden">
					<MyFullReport reports={reports} loadingFull={loadingFull} errorFull={errorFull} successFull={successFull} language={language} onGetReports={this.props.onGetReports} onClose={this.props.onClose} />
				</DialogContent>
			</Dialog>
		);
	}
}
