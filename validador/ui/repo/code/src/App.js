import React, { Component } from "react";
import axios from "axios";

import { Collapse, Dialog, Slide, Typography } from "@mui/material";

import { uuidv4 } from "./helpers";

import MyDropzone from "./components/MyDropzone";
import MainAppBar from "./components/MainAppBar";
import Home from "./components/Home";
import MyFileReport from "./components/MyFileReport";
import FaqModal from "./components/MyFooter/FaqModal";

import Configs from "./configs/Configs.json";
import { Languages } from "./constants/Globals";
import restTmpl from "./resp.json";

import Classes from "./App.module.css";

import dictionary from "./App.dictionary.json";
import MyDialogEwpReport from "./components/MyFileReport/MyDialogEwpReport";


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class App extends Component {
	constructor(props) {

		console.log(Configs);
		super(props);
		this.inputFileRef = React.createRef();
	}

	state = {
		language: Languages[navigator.language.slice(0, 2)] ? Languages[navigator.language.slice(0, 2)].id : "en",
		bigScreen: window.innerWidth >= 1000,
		files: [],
		faqModalOpenned: false,
	};

	componentDidMount() {
		window.addEventListener("resize", this.windowResize);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.windowResize);
	}

	windowResize = () => {
		if (window.innerWidth >= 1000) {
			this.setState({ bigScreen: true });
		} else {
			this.setState({ bigScreen: false });
		}
	};

	inputFile = async ({ file: fileDump }) => {
		const { files } = this.state;
		const fileId = uuidv4();
		const file = {
			...fileDump,
			id: fileId,
			loading: true,
			ewpLoading: false,
			loadingFull: false,
			error: false,
			ewpError: false,
			errorFull: false,
			success: false,
			ewpSuccess: false,
			successFull: false,
			reports: {},
			ewpReport: {},
		};
		this.setState({ files: [...files, file] });
		this.getReports({
			bytes: fileDump.file.split(",")[1],
			fileId,
			name: file.name,
			resources: [
				"simpleReport",
				"simpleReportXML",
				"simpleReportHTML",
				// "simpleReportPDF",
				// "detailedReport",
				"detailedReportXML",
				"detailedReportHTML",
				// "detailedReportPDF",
				"diagnosticDataXML",
				"diagnosticDataSVG",
				// "validationReport",
				"validationReportXML",
				"certificates",
			],
		});
		this.inputFileRef.current.value = null;
	};

	getReports = async ({ bytes, fileId, name, resources }) => {
		const reports = await this.getReportsFromServer({ bytes, name, resources });
		if (reports) {
			const { files } = this.state;
			const fileDump = files.find(({ id }) => id === fileId);
			if (fileDump) {
				const newFile = { ...fileDump, loading: false, success: true, reports: { ...fileDump.reports, ...reports } };
				this.setState({ files: files.map((file) => (file.id === fileId ? newFile : file)) });
				return reports;
			}
		}
		const { files } = this.state;
		const fileDump = files.find(({ id }) => id === fileId);
		if (fileDump) {
			const newFile = { ...fileDump, loading: false, error: true };
			this.setState({ files: files.map((file) => (file.id === fileId ? newFile : file)) });
		}
	};

	getEwp = async ({ id: fileId }) => {
		const { files } = this.state;
		const fileDump = files.find(({ id }) => id === fileId);
		this.setState({ files: files.map((file) => (file.id === fileId ? { ...fileDump, ewpLoading: true, ewpError: false } : file)) });
		const report = await this.getReportsFromEwp({ payload: fileDump.formData });
		if (report) {
			const newFile = { ...fileDump, ewpLoading: false, ewpSuccess: true, ewpReport: report };
			this.setState({ files: files.map((file) => (file.id === fileId ? newFile : file)) });
			return report;
		}
		if (fileDump) {
			const newFile = { ...fileDump, ewpLoading: false, ewpError: true, ewpReport: restTmpl };
			this.setState({ files: files.map((file) => (file.id === fileId ? newFile : file)) });
		}
	};

	deleteFile = ({ id }) => {
		const { files } = this.state;
		this.setState({ files: files.filter(({ id: fileId }) => fileId !== id) });
	};

	getReportsFromServer = async ({ bytes, name, resources }) => {
		try {
			const resp = await axios.post(`${Configs.coreUrl}/api/v2/validation/document`, { dataToValidate: { signedDocument: { bytes, name }, tokenExtractionStrategy: "EXTRACT_ALL" }, resources });
			if (resp && resp.data) {
				return Object.fromEntries(Object.entries(resp.data).filter(([_, v]) => v != null));
			}
		} catch (error) { }
	};

	getReportsFromEwp = async ({ payload }) => {
		try {
			const resp = await axios.post(`https://module.esva.dev.uporto.pt/validador/ola`, payload);
			if (resp && resp.data) {
				return Object.fromEntries(Object.entries(resp.data).filter(([_, v]) => v != null));
			}
		} catch (error) { }
	};

	render() {
		const { bigScreen, files, faqModalOpenned, language } = this.state;
		return (
			<MyDropzone inputFileRef={this.inputFileRef} onInputFile={this.inputFile}>
				<div className={`w-100 h-100 ${Classes.Main}`} style={{ overflow: "hidden", cursor: "default" }}>
					<MainAppBar bigScreen={bigScreen} showTitle={Boolean(files.length)} language={language} onUpdateLanguage={({ language }) => this.setState({ language })} />
					<div className="w-100" style={{ height: "calc(100vh - 90px)", overflow: "hidden" }}>
						<div className={`w-100 ${Classes.Main}`} style={{ height: "200%", transform: `translateY(-${files.length ? 50 : 0}%)`, transition: "all 1s" }}>
							<div className="w-100 h-50 pt-3">
								<Home language={language} onFileInput={() => this.inputFileRef.current.click()} onOpenFaq={() => this.setState({ faqModalOpenned: true })} />
							</div>
							<div className="w-100 h-50 pb-3 d-flex flex-column" style={{ overflow: "hidden" }}>
								<Collapse in={!bigScreen && Boolean(files.length)} mountOnEnter unmountOnExit appear timeout={500}>
									<Typography variant="h4" align="center" className="mb-3" color="white">
										{dictionary.title[language]}
									</Typography>
								</Collapse>
								<div className="w-100 h-100 pt-3 px-3 flex-grow-1" style={{ overflow: "hidden auto" }}>
									{files.map((file) => (
										<MyFileReport key={file.id} file={file} language={language} onDeleteFile={this.deleteFile} onGetReports={this.getReports} onLoadEwp={this.getEwp} />
									))}
								</div>
							</div>
						</div>
						<Dialog open={faqModalOpenned} fullScreen className="p-0 p-md-3 p-xl-5" TransitionComponent={Transition} onClose={() => this.setState({ faqModalOpenned: false })}>
							<FaqModal language={language} onClose={() => this.setState({ faqModalOpenned: false })} />
						</Dialog>
					</div>
				</div>
			</MyDropzone>
		);
	}
}

export default App;
