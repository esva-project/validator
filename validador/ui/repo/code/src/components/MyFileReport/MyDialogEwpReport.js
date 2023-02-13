import React, { Component } from "react";

import { Slide, Dialog, DialogContent } from "@mui/material";

import MyEwpReport from "../MyEwpReport";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default class MyDialogEwpReport extends Component {
	render() {
		const { open, report, language } = this.props;
		return (
			<Dialog open={open} className="p-4" fullScreen TransitionComponent={Transition} onClose={this.props.onClose}>
				<DialogContent className="p-0 overflow-hidden">
					<MyEwpReport report={report} language={language} onClose={this.props.onClose} />
				</DialogContent>
			</Dialog>
		);
	}
}
