import React, { Component } from "react";

import { Accordion, AccordionSummary, Icon, AccordionDetails, IconButton, Collapse, Tooltip, Slide } from "@mui/material";
import { red, lightGreen, orange } from "@mui/material/colors";

import Classes from "./MySignature.module.css";

import Img from "./timestamp.png";

import dictionary from "./MySignature.dictionary.json";

export default class MySignature extends Component {
	constructor(props) {
		super(props);
		this.containerRef = React.createRef();
	}

	state = {
		timestampDelay: false,
		certificateExpanded: false,
		ouExpanded: false,
	};

	componentDidMount() {
		const { signatureFormat } = this.props.signature;
		if (signatureFormat?.includes("_T") || signatureFormat?.includes("_LT") || signatureFormat?.includes("_LTA")) {
			setTimeout(() => this.setState({ timestampDelay: true }), 500);
		}
	}

	downloadCertificate = (event) => {
		event.stopPropagation();
		const { certificates, signature } = this.props;
		const certificate = certificates.find((cert) => cert.id === signature.certificateChain.certificate[0].id);
		if (certificate && certificate.base64Encoded) {
			const { base64Encoded } = certificate;
			const data = new Blob([base64Encoded], { type: "application/x-x509-user-cert" });
			const downloadLink = document.createElement("a");
			downloadLink.href = window.URL.createObjectURL(data);
			downloadLink.download = `${signature.signedBy}.crt`;
			downloadLink.click();
		}
	};

	render() {
		const { timestampDelay, certificateExpanded, ouExpanded } = this.state;
		const { certificates, signature, language } = this.props;
		const certificate = certificates.find((cert) => cert.id === signature.certificateChain.certificate[0].id);
		const subjectDistinguishedName = certificate?.subjectDistinguishedName?.find((subject) => subject.format === "RFC2253");
		const subjectDistinguishedNameValue = subjectDistinguishedName ? subjectDistinguishedName.value : "";
		const ous = subjectDistinguishedNameValue
			? subjectDistinguishedNameValue
					.split(",")
					.filter((str) => str.startsWith("OU="))
					.map((str) => str.substr(3))
			: [];
		const specialOu = ous.find((ou) => ou.startsWith("Entitlement - "));
		const dsOu = specialOu ? specialOu.substr(13) : null;
		return (
			<div className="p-2 col-md-6 col-xl-4">
				<div
					className="border shadow rounded p-3"
					style={{
						backgroundColor: signature.indication === "TOTAL_PASSED" ? lightGreen[50] : signature.indication === "TOTAL_FAILED" ? red[50] : orange[50],
						position: "relative",
						overflow: "hidden",
					}}
					ref={this.containerRef}
				>
					<Slide in={timestampDelay} direction="down" mountOnEnter unmountOnExit appear timeout={500} container={this.containerRef.current}>
						<Tooltip title={dictionary.fromTimestampService[language]} arrow>
							<img src={Img} alt="Timestamp Img" style={{ width: 50, position: "absolute", bottom: 7, right: 10 }} />
						</Tooltip>
					</Slide>
					<Accordion expanded={certificateExpanded} className={Classes.CustomAccordion} onChange={() => this.setState({ certificateExpanded: !certificateExpanded })}>
						<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
							<div className="w-100 d-flex justify-content-between align-items-center">
								<dl className="mb-0 d-flex flex-wrap">
									<dt className="me-1 mb-1">{dictionary.signedBy[language]}</dt>
									<dd>{signature.signedBy}</dd>
								</dl>
								<div>
									<Tooltip title={dictionary.downloadCertificate[language]}>
										<span>
											<IconButton size="small" onClick={this.downloadCertificate}>
												<Icon>card_membership</Icon>
											</IconButton>
										</span>
									</Tooltip>
								</div>
							</div>
						</AccordionSummary>
						<AccordionDetails className="py-0 text-break">
							<div>
								<dl className="mb-0 d-flex flex-wrap">
									<dt className="me-1 mb-1">{dictionary.commonName[language]}</dt>
									<dd>{certificate?.commonName}</dd>
								</dl>
								<dl className="mb-0 d-flex flex-wrap">
									<dt className="me-1 mb-1">{dictionary.countryName[language]}</dt>
									<dd>{certificate?.countryName}</dd>
								</dl>
								<dl className="mb-0 d-flex flex-wrap">
									<dt className="me-1 mb-1">{dictionary.email[language]}</dt>
									<dd>{certificate?.email}</dd>
								</dl>
								<dl className="mb-0 d-flex flex-wrap">
									<dt className="me-1 mb-1">{dictionary.subjectSerialName[language]}</dt>
									<dd>{certificate?.subjectSerialNumber}</dd>
								</dl>
								<dl className="mb-0 d-flex flex-wrap">
									<dt className="me-1 mb-1">{dictionary.organizationIdentifier[language]}</dt>
									<dd>{certificate?.organizationIdentifier}</dd>
								</dl>
								<dl className="mb-0 d-flex flex-wrap">
									<dt className="me-1 mb-1">{dictionary.sources[language]}</dt>
									<dd>{certificate?.sources.join(", ")}</dd>
								</dl>
								<dl className={["mb-0 d-flex flex-wrap align-items-center", ouExpanded ? "mt-4" : null].join(" ")} style={{ cursor: "pointer", transition: "all 0.3s" }} onClick={() => this.setState({ ouExpanded: !ouExpanded })}>
									<IconButton size="small">
										<Icon style={{ transition: "all 0.2s", transform: `rotate(${ouExpanded ? "180" : "0"}deg)` }}>expand_more</Icon>
									</IconButton>
									<dt className="me-1 mb-1">{dictionary.organizationUnits[language]}</dt>
								</dl>
								<Collapse in={ouExpanded} className={Classes.CustomCollaose} onChange={() => this.setState({ ouExpanded: !ouExpanded })}>
									<ul className="pl-1 my-4 ms-4">
										{ous.map((ou, index) => (
											<dl key={index} className="mb-0">
												<dd>{ou}</dd>
											</dl>
										))}
									</ul>
								</Collapse>
							</div>
						</AccordionDetails>
					</Accordion>
					<dl className="mb-0 d-flex flex-wrap">
						<dt className="me-1 mb-1">{dictionary.organizationName[language]}</dt>
						<dd>{certificate?.organizationName}</dd>
					</dl>
					{dsOu && (
						<dl className="mb-0 d-flex flex-wrap">
							<dt className="me-1 mb-1">{dictionary.entitlement[language]}</dt>
							<dd>{dsOu}</dd>
						</dl>
					)}
					<dl className="mb-0 d-flex flex-wrap">
						<dt className="me-1 mb-1">{dictionary.qualification[language]}</dt>
						<dd>{`${signature.signatureLevel?.description} (${signature.signatureLevel?.value})`}</dd>
					</dl>
					<dl className="mb-0 d-flex flex-wrap">
						<dt className="me-1 mb-1">{dictionary.signatureFormat[language]}</dt>
						<dd>{signature.signatureFormat}</dd>
					</dl>
					<dl className="mb-0 d-flex flex-wrap">
						<dt className="me-1 mb-1">{dictionary.bestSignatureTime[language]}</dt>
						<dd>{signature.bestSignatureTime}</dd>
					</dl>
					<dl className="mb-0 d-flex flex-wrap">
						<dt className="me-1 mb-1">{dictionary.indication[language]}</dt>
						{signature.indication === "TOTAL_PASSED" ? (
							<dd className="text-success">
								<span className="badge bg-success">{signature.indication}</span>
							</dd>
						) : signature.indication === "TOTAL_FAILED" ? (
							<dd className="text-danger">
								<span className="badge bg-danger">{signature.indication}</span>
							</dd>
						) : (
							<dd className="text-warning">
								<span className="badge bg-warning">{signature.indication}</span>
							</dd>
						)}
					</dl>
				</div>
			</div>
		);
	}
}
