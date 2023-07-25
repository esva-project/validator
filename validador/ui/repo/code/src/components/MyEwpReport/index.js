import React, { useState } from "react";

import { AppBar, Collapse, DialogContent, Icon, IconButton, Tab, Tabs } from "@mui/material";

import { indigo } from "@mui/material/colors";
import DataCollection from "./DataCollection";
import EWPReport from "./EWPReport";

const MyEwpReport = (props) => {
	const { report, onClose } = props;
	const [selectedTab, setSelectedTab] = useState(0);

	return (
		<div className="w-100 h-100">
			<AppBar className="flex-grow-1 py-2 text-white" position="static" color="inherit" style={{ backgroundColor: indigo[500] }}>
				<div className="w-100 d-flex justify-content-between gap-2">
					<Tabs value={selectedTab} variant="scrollable" indicatorColor="primary" textColor="inherit" className="ms-2" onChange={(_, value) => setSelectedTab(value)}>
						<Tab value={0} label={"EWP Report"} />
						<Tab value={1} label={"Data Collection"} />
					</Tabs>
					<IconButton color="inherit" onClick={onClose} className="me-2">
						<Icon>close</Icon>
					</IconButton>
				</div>
			</AppBar>

			<DialogContent className="h-100 p-0">
				<div className="flex-grow-1 h-100 d-flex flex-column">
					<Collapse in={selectedTab === 0} unmountOnExit orientation="horizontal">
						<div className="h-100" style={{ width: "calc(100vw - 24px - 24px)", overflowY: "auto", transition: "all 460ms cubic-bezier(0.4, 0, 0.6, 1) 0ms" }}>
							<EWPReport report={report} />
						</div>
					</Collapse>
					<Collapse in={selectedTab === 1} unmountOnExit orientation="horizontal">
						<div className="h-100" style={{ width: "calc(100vw - 24px - 24px)", overflowY: "auto", transition: "all 460ms cubic-bezier(0.4, 0, 0.6, 1) 0ms" }}>
							<DataCollection report={report} />
						</div>
					</Collapse>
				</div>
			</DialogContent>
		</div>
	);
};

export default MyEwpReport;
