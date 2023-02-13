import React, { Component } from "react";

import { AppBar, Collapse, Slide, Toolbar, Typography } from "@mui/material";

import LanguageMenu from "./LanguageMenu";

import ImgESVA from "../../assets/esva_logo.svg";
import ImgCeLock from "../../assets/ce_lock_no_bg.png";

import dictionary from "./index.dictionary.json";

export default class MainAppBar extends Component {
	state = {
		anim1: false,
		anim2: false,
	};

	componentDidMount() {
		setTimeout(() => this.setState({ anim1: true }), 1000);
		setTimeout(() => this.setState({ anim2: true }), 1000);
	}

	render() {
		const { anim1, anim2 } = this.state;
		const { bigScreen, showTitle, language } = this.props;
		return (
			<Slide in={anim1} timeout={500} direction="down">
				<AppBar color="inherit" position="static" elevation={15} style={{ height: 90 }}>
					<Toolbar className="h-100">
						<div style={{ maxWidth: 256, minWidth: 200 }}>
							<Slide in={anim2} mountOnEnter unmountOnExit appear timeout={500} direction="right">
								<a href="https://esva-project.eu/" target="_blank" rel="noopener noreferrer">
									<img src={ImgESVA} alt="ImgESVA" style={{ maxHeight: "45%", maxWidth: "45%" }} />
								</a>
							</Slide>
						</div>
						<div className="flex-grow-1 d-flex align-items-center justify-content-center">
							<Collapse in={bigScreen && showTitle} mountOnEnter unmountOnExit appear timeout={500}>
								<Typography variant="h4">{dictionary.title[language]}</Typography>
							</Collapse>
						</div>
						<div className="ms-4">
							<LanguageMenu language={language} onUpdateLanguage={this.props.onUpdateLanguage} />
						</div>
						<div className="ms-4" style={{ maxWidth: 42, minWidth: 25 }}>
							<Slide in={anim2} mountOnEnter unmountOnExit appear timeout={500} direction="left">
								<img src={ImgCeLock} alt="CeLock" style={{ maxHeight: "100%", maxWidth: "100%" }} />
							</Slide>
						</div>
					</Toolbar>
				</AppBar>
			</Slide>
		);
	}
}
