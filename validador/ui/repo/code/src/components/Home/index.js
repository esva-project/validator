import React, { Component } from "react";

import { Button, Typography, Zoom } from "@mui/material";

import ImgAuth from "../../assets/auth_logo.png";
import ImgDigitalSign from "../../assets/digitalsign_logo.png";
import ImgEuf from "../../assets/euf_logo.png";
import ImgMendel from "../../assets/mendel_logo.png";
import ImgUPorto from "../../assets/uporto_logo.png";
import Img1 from "./img1.png";

import Classes from "./index.module.css";

import MyFooter from "../MyFooter";

import dictionary from "./index.dictionary.json";

import PrivacyPolicy from "../../assets/privacy-policy.pdf";

export default class Home extends Component {
	state = {
		anim1: false,
	};

	componentDidMount() {
		setTimeout(() => this.setState({ anim1: true }), 500);
	}

	render() {
		const { anim1 } = this.state;
		const { language } = this.props;
		return (
			<div className="w-100 h-100 d-flex flex-column" style={{ overflow: "hidden auto" }}>
				<div className="w-100 container d-flex flex-grow-1 flex-column pb-4">
					<Typography variant="h4" align="center" className="mt-0 mt-sm-3 mb-1 mb-sm-0" color="white">
						{dictionary.title[language]}
					</Typography>
					<Zoom in={anim1} timeout={500}>
						<div className="w-100 flex-grow-1 d-flex align-items-center">
							<div className="w-100">
								<Typography align="center" color="white" className="mb-2">
									{dictionary.whenUsingThisValidator[language]}{" "}
									<a href={PrivacyPolicy} target="_blank" rel="noopener noreferrer">
										{dictionary.privacyPolicy[language]}
									</a>
									.
								</Typography>
								<Typography align="center" color="white" className="mb-2">
									{dictionary.dragYourPdfs[language]}
								</Typography>
								<div className="w-100 d-flex justify-content-center">
									<div className="w-100 d-flex justify-content-center" style={{ maxWidth: 500, width: "100%", position: "relative" }}>
										<img src={Img1} alt="Img1" style={{ maxWidth: "100%" }} />
										<div className="w-100 d-flex justify-content-center" style={{ position: "absolute", bottom: "8%", height: "51%" }}>
											<div style={{ width: "32%", marginLeft: "1%" }}>
												<p className={Classes.Arrow} style={{ cursor: "pointer" }} onClick={this.props.onFileInput}>
													<a hreef="#"></a>
												</p>
											</div>
										</div>
									</div>
								</div>
								<Typography align="center" color="white" className="mb-2">
									{dictionary.andValidate[language]}
								</Typography>
								<div className="w-100 d-flex justify-content-center mb-2 mb-sm-5">
									<Button variant="contained" color="warning" onClick={this.props.onOpenFaq}>
										{dictionary.findMore[language]}
									</Button>
								</div>
								<div className="text-center">
									<Typography variant="caption" color="white">
										{dictionary.footer[language]}
									</Typography>
								</div>
							</div>
						</div>
					</Zoom>
				</div>
				<Zoom in={anim1} timeout={500}>
					<div className="w-100 pt-3" style={{ backgroundColor: "#f5f5f5" }}>
						<div className="w-100 d-flex" style={{ backgroundColor: "#f5f5f5" }}>
							<div className="w-100 d-flex flex-wrap justify-content-center align-items-center">
								<a className="m-2" href="https://www.up.pt" target="_blank" style={{ width: 170, height: 130 }} rel="noopener noreferrer">
									<img src={ImgUPorto} alt="ImgUPorto" style={{ maxHeight: "95%", maxWidth: "95%" }} />
								</a>
								<a className="m-2" href="https://www.digitalsign.pt" target="_blank" style={{ width: 170, height: 130 }} rel="noopener noreferrer">
									<img src={ImgDigitalSign} alt="ImgDigitalSign" style={{ maxHeight: "95%", maxWidth: "95%" }} />
								</a>
								<a className="m-2" href="https://mendelu.cz" target="_blank" style={{ width: 170, height: 130 }} rel="noopener noreferrer">
									<img src={ImgMendel} alt="ImgMendel" style={{ maxHeight: "95%", maxWidth: "95%" }} />
								</a>
								<a className="m-2" href="https://www.auth.gr" target="_blank" style={{ width: 170, height: 130 }} rel="noopener noreferrer">
									<img src={ImgAuth} alt="ImgAuth" style={{ maxHeight: "95%", maxWidth: "95%" }} />
								</a>
								<a className="m-2" href="https://uni-foundation.eu/" target="_blank" style={{ width: 170, height: 130 }} rel="noopener noreferrer">
									<img src={ImgEuf} alt="ImgEuf" style={{ maxHeight: "95%", maxWidth: "95%" }} />
								</a>
								{/* <div className="m-2" style={{ width: 170, height: 130 }}>
								<img src={ImgCef} alt="ImgCef" style={{ maxHeight: "95%", maxWidth: "95%" }} />
							</div> */}
							</div>
						</div>
						<MyFooter language={language} onOpenFaq={() => this.setState({ faqModalOpenned: true })} onCloseFaq={() => this.setState({ faqModalOpenned: false })} />
					</div>
				</Zoom>
			</div>
		);
	}
}
