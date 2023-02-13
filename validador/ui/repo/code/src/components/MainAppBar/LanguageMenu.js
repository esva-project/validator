import React, { Component, Fragment } from "react";

import { Icon, Button, Menu, ListItem, ListItemText } from "@mui/material";

import { Languages } from "../../constants/Globals";

import dictionary from "./LanguageMenu.dictionary.json";

export default class LanguageMenu extends Component {
	state = {
		anchorEl: null,
	};

	updateLanguage = async (payload) => {
		this.props.onUpdateLanguage(payload);
		this.setState({ anchorEl: null });
	};

	render() {
		const { anchorEl } = this.state;
		const { language } = this.props;
		return (
			<Fragment>
				<div style={{ color: "black" }}>
					<Button variant="outlined" color="inherit" className="px-0 text-capitalize" onClick={({ currentTarget: anchorEl }) => this.setState({ anchorEl })}>
						<span className="d-flex">
							<img src={Languages[language].img} className="my-auto" width="25" height="16" alt="" />
							<Icon>arrow_drop_down</Icon>
						</span>
					</Button>
				</div>
				<Menu open={Boolean(anchorEl)} anchorEl={anchorEl} MenuListProps={{ style: { padding: 0 } }} onClose={() => this.setState({ anchorEl: null })}>
					<ListItem style={{ backgroundColor: "rgba(9, 9, 121, 1)", cursor: "default" }}>
						<ListItemText className="text-white font-weight-bold">{dictionary.language[language]}</ListItemText>
					</ListItem>
					{Object.values(Languages).map((lang, index) => (
						<ListItem key={index} button style={{ backgroundColor: lang.id === language ? "rgba(0, 0, 0, 0.2)" : null }} onClick={() => this.updateLanguage({ language: lang.id })}>
							<img src={lang.img} width="25" height="16" alt="" />
							<ListItemText className="ms-3" primary={dictionary[lang.id][language]} />
						</ListItem>
					))}
				</Menu>
			</Fragment>
		);
	}
}
