import React, { Component } from "react";

import { Typography, Slide } from "@mui/material";

import ImgCef from "../../assets/cef_logo.png";

import dictionary from "./index.dictionary.json";

export default class MyFooter extends Component {
	state = {
		anim1: false,
	};

	componentDidMount() {
		setTimeout(() => this.setState({ anim1: true }), 1500);
	}

	render() {
		const { anim1 } = this.state;
		const { language } = this.props;
		return (
			<Slide in={anim1} unmountOnExit appear timeout={500} direction="up">
				<div className="w-100" style={{ backgroundColor: "rgba(44, 48, 112, 1)" }}>
					<div className="container py-2 py-sm-0">
						<div className="row">
							<div className="col-12 col-md-6 align-self-center">
								<Typography variant="caption" className="text-center text-white" color="black">
									{dictionary.copyrights[language].replace("{year}", new Date().getFullYear())}
								</Typography>
							</div>
							<div className="col-12 col-md-6">
								<img src={ImgCef} alt="ImgCef" style={{ maxHeight: "95%", maxWidth: "95%" }} />
							</div>
						</div>
					</div>
				</div>
			</Slide>
		);
	}
}
