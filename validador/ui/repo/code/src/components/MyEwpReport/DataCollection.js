import { CardContent, Collapse, Tab, Tabs, Toolbar } from "@mui/material";
import { indigo } from "@mui/material/colors";
import React, { useState } from "react";
import DataEWP from "./DataEWP";
import DataSignatures from "./DataSignatures";

const DataCollection = (props) => {
	const { report } = props;
	const [selectedTab, setSelectedTab] = useState(0);

	return (
		<div className="w-100">
			<Toolbar variant="dense" position="static" className="text-white" style={{ backgroundColor: indigo[400] }}>
				<Tabs value={selectedTab} variant="scrollable" indicatorColor="primay" textColor="inherit" onChange={(_, value) => setSelectedTab(value)}>
					<Tab value={0} label={"Data Found in EWP"} />
					<Tab value={1} label={"Data Found in Signatures"} />
				</Tabs>
			</Toolbar>
			<Collapse in={selectedTab === 0} timeout={500}>
				<CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 91.2px - 64px)" }}>
					<DataEWP report={report} />
				</CardContent>
			</Collapse>
			<Collapse in={selectedTab === 1} timeout={500}>
				<CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 91.2px - 64px)" }}>
					<DataSignatures report={report} />
				</CardContent>
			</Collapse>
		</div>
	);
};

export default DataCollection;
