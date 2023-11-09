import { Accordion, AccordionDetails, AccordionSummary, CardContent, Icon, Tooltip, Typography } from "@mui/material";
import { grey, indigo } from "@mui/material/colors";
import React, { Fragment } from "react";

const DataEWP = (props) => {
	const { report } = props;

	return (
		<div className="w-100">
			<CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 91.2px - 64px)" }}>
				<Accordion defaultExpanded square>
					<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" style={{ backgroundColor: grey[200] }}>
						<Typography className="fw-bold">Sending Institution</Typography>
					</AccordionSummary>
					<AccordionDetails className="d-flex flex-column gap-1 justify-content-center">
						<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
							<dt className="me-1">SCHAC Code:</dt>
							<dd className="mb-2">{report.response.dataCollection.ewpData.sending_hei.schac_code}</dd>
						</dl>
						<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
							<dt className="me-1">OUnit of the Mobility:</dt>
							<div className="d-flex flex-column gap-1">
								{report.response.dataCollection.ewpData.sending_hei.ounit_name.map((el, i) => {
									return (
										<div key={i} className="d-flex gap-1">
											<dd className="mb-2">{el.value}</dd>
											{el.api_fetched.length ? (
												<Tooltip
													title={
														<Fragment>
															<Typography color="inherit">Found in APIs:</Typography>
															{el.api_fetched.map((el, i) => {
																return (
																	<Typography key={i} color="inherit">
																		{el}
																	</Typography>
																);
															})}
														</Fragment>
													}
												>
													<Icon sx={{ color: indigo[400] }}>info</Icon>
												</Tooltip>
											) : null}
										</div>
									);
								})}
							</div>
						</dl>
						<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
							<dt className="me-1">Contact List of Institution:</dt>
							<div className="d-flex flex-column gap-1">
								<div className="d-flex flex-column gap-1">
									{report.response.dataCollection.ewpData.sending_hei.institution_contacts.map((el, i) => {
										return (
											<div key={i} className="d-flex gap-1">
												<dd className="mb-2">
													{el["contact-name"]} ({el.email}) - {el["role-description"]}
												</dd>
												{el.api_fetched.length ? (
													<Tooltip
														title={
															<Fragment>
																<Typography color="inherit">Found in APIs:</Typography>
																{el.api_fetched.map((el, i) => {
																	return (
																		<Typography key={i} color="inherit">
																			{el}
																		</Typography>
																	);
																})}
															</Fragment>
														}
													>
														<Icon sx={{ color: indigo[400] }}>info</Icon>
													</Tooltip>
												) : null}
											</div>
										);
									})}
								</div>
							</div>
						</dl>
						<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
							<dt className="me-1">Contact List of Organizational Unit:</dt>
							<div className="d-flex flex-column gap-1">
								<div className="d-flex flex-column gap-1">
									{report.response.dataCollection.ewpData.sending_hei.ounit_contacts.map((el, i) => {
										return (
											<div key={i} className="d-flex gap-1">
												<dd className="mb-2">
													{el["contact-name"]} ({el.email}) {el["role-description"] ? `- ${el["role-description"]}` : ""}
												</dd>
												{el.api_fetched.length ? (
													<Tooltip
														title={
															<Fragment>
																<Typography color="inherit">Found in APIs:</Typography>
																{el.api_fetched.map((el, i) => {
																	return (
																		<Typography key={i} color="inherit">
																			{el}
																		</Typography>
																	);
																})}
															</Fragment>
														}
													>
														<Icon sx={{ color: indigo[400] }}>info</Icon>
													</Tooltip>
												) : null}
											</div>
										);
									})}
								</div>
							</div>
						</dl>
					</AccordionDetails>
				</Accordion>
				<Accordion square>
					<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" style={{ backgroundColor: grey[200] }}>
						<Typography className="fw-bold">Student</Typography>
					</AccordionSummary>
					<AccordionDetails className="d-flex flex-column gap-1 justify-content-center">
						<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
							<dt className="me-1">Name:</dt>
							<div className="d-flex gap-1">
								<dd className="mb-2">{report.response.dataCollection.ewpData.student.contact_person_name.value}</dd>
								{report.response.dataCollection.ewpData.student.contact_person_name.api_fetched.length ? (
									<Tooltip
										title={
											<Fragment>
												<Typography color="inherit">Found in APIs:</Typography>
												{report.response.dataCollection.ewpData.student.contact_person_name.api_fetched.map((el, i) => {
													return (
														<Typography key={i} color="inherit">
															{el}
														</Typography>
													);
												})}
											</Fragment>
										}
									>
										<Icon sx={{ color: indigo[400] }}>info</Icon>
									</Tooltip>
								) : null}
							</div>
						</dl>
						<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
							<dt className="me-1">Email:</dt>
							<div className="d-flex gap-1">
								<dd className="mb-2">{report.response.dataCollection.ewpData.student.contact_person_email.value}</dd>
								{report.response.dataCollection.ewpData.student.contact_person_email.api_fetched.length ? (
									<Tooltip
										title={
											<Fragment>
												<Typography color="inherit">Found in APIs:</Typography>
												{report.response.dataCollection.ewpData.student.contact_person_email.api_fetched.map((el, i) => {
													return (
														<Typography key={i} color="inherit">
															{el}
														</Typography>
													);
												})}
											</Fragment>
										}
									>
										<Icon sx={{ color: indigo[400] }}>info</Icon>
									</Tooltip>
								) : null}
							</div>
						</dl>
					</AccordionDetails>
				</Accordion>
				<Accordion square>
					<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" style={{ backgroundColor: grey[200] }}>
						<Typography className="fw-bold">Receiving Institution</Typography>
					</AccordionSummary>
					<AccordionDetails className="d-flex flex-column gap-1 justify-content-center">
						<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
							<dt className="me-1">SCHAC Code:</dt>
							<dd className="mb-2">{report.response.dataCollection.ewpData.receiving_hei.schac_code}</dd>
						</dl>
						<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
							<dt className="me-1">OUnit of the Mobility:</dt>
							<div className="d-flex flex-column gap-1">
								{report.response.dataCollection.ewpData.receiving_hei.ounit_name.map((el, i) => {
									return (
										<div key={i} className="d-flex gap-1">
											<dd className="mb-2">{el.value}</dd>
											{el.api_fetched.length ? (
												<Tooltip
													title={
														<Fragment>
															<Typography color="inherit">Found in APIs:</Typography>
															{el.api_fetched.map((el, i) => {
																return (
																	<Typography key={i} color="inherit">
																		{el}
																	</Typography>
																);
															})}
														</Fragment>
													}
												>
													<Icon sx={{ color: indigo[400] }}>info</Icon>
												</Tooltip>
											) : null}
										</div>
									);
								})}
							</div>
						</dl>
						<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
							<dt className="me-1">Contact List of Institution:</dt>
							<div className="d-flex flex-column gap-1">
								<div className="d-flex flex-column gap-1">
									{report.response.dataCollection.ewpData.receiving_hei.institution_contacts.map((el, i) => {
										return (
											<div key={i} className="d-flex gap-1">
												<dd className="mb-2">
													{el["contact-name"]} ({el.email}) - {el["role-description"]}
												</dd>
												{el.api_fetched.length ? (
													<Tooltip
														title={
															<Fragment>
																<Typography color="inherit">Found in APIs:</Typography>
																{el.api_fetched.map((el, i) => {
																	return (
																		<Typography key={i} color="inherit">
																			{el}
																		</Typography>
																	);
																})}
															</Fragment>
														}
													>
														<Icon sx={{ color: indigo[400] }}>info</Icon>
													</Tooltip>
												) : null}
											</div>
										);
									})}
								</div>
							</div>
						</dl>
						<dl className="mb-2 d-flex flex-sm-column flex-md-row justify-content-md-start justify-content-sm-start gap-2">
							<dt className="me-1">Contact List of Organizational Unit:</dt>
							<div className="d-flex flex-column gap-1">
								<div className="d-flex flex-column gap-1">
									{report.response.dataCollection.ewpData.receiving_hei.ounit_contacts.map((el, i) => {
										return (
											<div key={i} className="d-flex gap-1">
												<dd className="mb-2">
													{el["contact-name"]} ({el.email}) {el["role-description"] ? `- ${el["role-description"]}` : ""}
												</dd>
												{el.api_fetched.length ? (
													<Tooltip
														title={
															<Fragment>
																<Typography color="inherit">Found in APIs:</Typography>
																{el.api_fetched.map((el, i) => {
																	return (
																		<Typography key={i} color="inherit">
																			{el}
																		</Typography>
																	);
																})}
															</Fragment>
														}
													>
														<Icon sx={{ color: indigo[400] }}>info</Icon>
													</Tooltip>
												) : null}
											</div>
										);
									})}
								</div>
							</div>
						</dl>
					</AccordionDetails>
				</Accordion>
			</CardContent>
		</div>
	);
};

export default DataEWP;
