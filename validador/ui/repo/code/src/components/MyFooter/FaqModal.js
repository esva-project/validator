import React, { Component, Fragment } from "react";

import { Typography, DialogTitle, IconButton, Icon, DialogContent, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

import Img1 from "../../assets/img1.jpg";
import Img2 from "../../assets/img2.jpg";
import Img3 from "../../assets/img3.jpg";

import dictionary from "./FaqModal.dictionary.json";

export default class FaqModal extends Component {
	state = {
		selected: -1,
	};

	render() {
		const { selected } = this.state;
		const { language } = this.props;
		return (
			<Fragment>
				<DialogTitle style={{ background: `linear-gradient(to right,rgba(223, 95, 63, 1) 0%, rgba(191, 30, 105, 1) 50%, rgba(44, 48, 112, 1) 100%)`, transition: "all 500ms", color: "white" }}>
					<div className="w-100 d-flex justify-content-between align-items-center">
						<Typography variant="inherit" className="me-5">
							{dictionary.faqs[language]}
						</Typography>
						<IconButton size="small" style={{ color: "#fff" }} onClick={this.props.onClose}>
							<Icon>close</Icon>
						</IconButton>
					</div>
				</DialogTitle>
				<DialogContent className="pt-4">
					{language === "en" ? (
						<Accordion expanded={selected === 0} onChange={() => this.setState({ selected: selected === 0 ? -1 : 0 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>What is a signature validator?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									The purpose of this tool is to validate a document and its electronic signatures using the DSS framework. All electronic signatures of the document are analyzed and reports are produced with the result of this
									validation.
									<br />
									<br />
									To process the validation, the tool retrieves all kinds of data like certificates, timestamps, revocation data, etc. This information can be embedded in signatures, collected from external sources (AIA, CRL, OCSP)
									or defined as trust chains (TrustedLists - LOTL and TL). With all this data, the application follows the latest ETSI standard to validate signatures (ETSI EN 319 102).
									<br />
									<br />
									This application may not recognize trust chains that are not part of LOTL and LT.
								</Typography>
							</AccordionDetails>
						</Accordion>
					) : (
						<Accordion expanded={selected === 0} onChange={() => this.setState({ selected: selected === 0 ? -1 : 0 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>Em que consiste um validador de assinaturas?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									O objetivo desta ferramenta ?? validar um documento e suas assinaturas eletr??nicas usando o framework DSS. Todas as assinaturas eletr??nicas do documento s??o analisadas e s??o produzidos relat??rios com o resultado
									dessa valida????o.
									<br />
									<br />
									Para processar a valida????o, a ferramenta recupera todos os tipos de dados como certificados, timestamps, dados de revoga????o, etc. Essas informa????es podem estar incorporadas nas assinaturas, recolhidas de fontes
									externas (AIA, CRL, OCSP) ou definidas como cadeias de confian??a (TrustedLists - LOTL e TL). Com todos esses dados, a aplica????o segue o mais recente padr??o ETSI para validar as assinaturas (ETSI EN 319 102).
									<br />
									<br />
									Esta aplica????o pode n??o reconhecer as cadeias de confian??a que n??o fa??am parte das LOTL e LT.
								</Typography>
							</AccordionDetails>
						</Accordion>
					)}
					{language === "en" ? (
						<Accordion expanded={selected === 1} onChange={() => this.setState({ selected: selected === 1 ? -1 : 1 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>How is a signature validated?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									According to REGULATION (EU) No 910/2014 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL of 23 July 2014, article 32, Point 1, the process of validating an electronic signature is described as follows:
									<br />
									<br />
									???1. The validation process of a qualified electronic signature confirms its validity depending on:
									<br />
									<br />
									&emsp;<b>a)</b> When signing, a qualified certificate of electronic signature must be supporting the signature, in accordance with Annex I;
									<br />
									&emsp;<b>b)</b> The qualified certificate had been issued by a qualified trusted service provider and is valid at the time of signature;
									<br />
									&emsp;<b>c)</b> The data for signature validation correspond to data provided to the user; L 257/102 Official Journal of the European Union 28.8.2014 PT
									<br />
									&emsp;<b>d)</b> The unique set of data representing the signer in the certificate is correctly provided to the user;
									<br />
									&emsp;<b>e)</b> The use of a pseudonym at the time of signing is clearly indicated to the user;
									<br />
									&emsp;<b>f)</b> The electronic signature had been created by a qualified electronic signature creation device;
									<br />
									&emsp;<b>g)</b> The integrity of signed data had not been affected;
									<br />
									&emsp;<b>h)</b> The requirements set out in article 26 are fulfilled at the time of signature;???
								</Typography>
							</AccordionDetails>
						</Accordion>
					) : (
						<Accordion expanded={selected === 1} onChange={() => this.setState({ selected: selected === 1 ? -1 : 1 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>Como ?? feita a valida????o de uma assinatura?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									Segundo o REGULAMENTO (UE) N.o 910/2014 DO PARLAMENTO EUROPEU E DO CONSELHO de 23 de julho de 2014, artigo 32??, Ponto 1, o processo de valida????o de uma assinatura eletr??nica ?? descrito assim:
									<br />
									<br />
									???1. O processo de valida????o de uma assinatura eletr??nica qualificada confirma a validade desta na condi????o de:
									<br />
									<br />
									&emsp;<b>a)</b> No momento da assinatura, o certificado que lhe serve de suporte ser um certificado qualificado de assinatura eletr??nica conforme com o disposto no anexo I;
									<br />
									&emsp;<b>b)</b> O certificado qualificado ter sido emitido por um prestador qualificado de servi??os de confian??a e ser v??lido no momento da assinatura;
									<br />
									&emsp;<b>c)</b> Os dados para a valida????o da assinatura corresponderem aos dados fornecidos ao utilizador; L 257/102 Jornal Oficial da Uni??o Europeia 28.8.2014 PT
									<br />
									&emsp;<b>d)</b> O conjunto ??nico de dados que representam o signat??rio no certificado serem corretamente fornecidos ao utilizador;
									<br />
									&emsp;<b>e)</b> A utiliza????o de um pseud??nimo no momento da assinatura ser claramente indicada ao utilizador;
									<br />
									&emsp;<b>f)</b> A assinatura eletr??nica ter sido criada por um dispositivo qualificado de cria????o de assinatura eletr??nica;
									<br />
									&emsp;<b>g)</b> A integridade dos dados assinados n??o ter sido afetada;
									<br />
									&emsp;<b>h)</b> Os requisitos previstos no artigo 26.o se encontrarem preenchidos no momento da assinatura;???
								</Typography>
							</AccordionDetails>
						</Accordion>
					)}
					{language === "en" ? (
						<Accordion expanded={selected === 2} onChange={() => this.setState({ selected: selected === 2 ? -1 : 2 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>What states can my signature assume?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									<b>TOTAL-PASSED:</b> when cryptographic checks of the signature were successful (including checks of hashes of individual data objects that were signed indirectly), as well as when all checks prescribed by the
									signature validation policy were approved.
									<br />
									<br />
									<b>TOTAL-FAILED:</b> cryptographic checks of the signature have failed (including checks of hashes of individual data objects that were signed indirectly), or the signature certificate is proven invalid at the time
									of signature creation, or because the signature does not conform to one of the base standards, as the cryptographic verification building block is unable to process it.
									<br />
									<br />
									<b>INDETERMINATED:</b> the results of checks carried out do not make it possible to verify whether the signature was TOTAL-PASSED or TOTAL-FAILED.
								</Typography>
							</AccordionDetails>
						</Accordion>
					) : (
						<Accordion expanded={selected === 2} onChange={() => this.setState({ selected: selected === 2 ? -1 : 2 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>Quais os estados que a minha assinatura pode assumir?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									<b>TOTAL-PASSED:</b> quando as verifica????es criptogr??ficas da assinatura (incluindo verifica????es de hashes de objetos de dados individuais que foram assinados indiretamente) tiveram sucesso, bem como todas as
									verifica????es prescritas pela pol??tica de valida????o de assinatura foram aprovadas.
									<br />
									<br />
									<b>TOTAL-FAILED:</b> as verifica????es criptogr??ficas da assinatura falharam (incluindo verifica????es de hashes de objetos de dados individuais que foram assinados indiretamente), ou ?? comprovado que o certificado de
									assinatura era inv??lido no momento da cria????o da assinatura, ou porque a assinatura n??o est?? em conformidade com um dos padr??es de base, na medida em que o bloco de constru????o de verifica????o criptogr??fica ?? incapaz
									de a processar.
									<br />
									<br />
									<b>INDETERMINATED:</b> os resultados das verifica????es realizadas n??o permitem verificar se a assinatura foi TOTAL-PASSED ou TOTAL-FAILED.
								</Typography>
							</AccordionDetails>
						</Accordion>
					)}

					{language === "en" ? (
						<Accordion expanded={selected === 3} onChange={() => this.setState({ selected: selected === 3 ? -1 : 3 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>Why do I have different stats in my document?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>This is due to the fact that the document has two or more signatures and, after validating them, it was proved that not all of them are valid or properly created.</Typography>
							</AccordionDetails>
						</Accordion>
					) : (
						<Accordion expanded={selected === 3} onChange={() => this.setState({ selected: selected === 3 ? -1 : 3 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>Porque ?? que tenho diferentes estados no meu documento?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>Isto deve-se ao facto de o documento possuir duas ou mais assinaturas, e ap??s a valida????o das mesmas, provou-se que nem todas s??o v??lidas ou devidamente criadas.</Typography>
							</AccordionDetails>
						</Accordion>
					)}
					{language === "en" ? (
						<Accordion expanded={selected === 4} onChange={() => this.setState({ selected: selected === 4 ? -1 : 4 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>How many signatures can I validate per document?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>All signatures each document contains are validated, and each one will have its own validation result.</Typography>
							</AccordionDetails>
						</Accordion>
					) : (
						<Accordion expanded={selected === 4} onChange={() => this.setState({ selected: selected === 4 ? -1 : 4 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>Quantas assinaturas posso validar por documento?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>Por cada documento s??o validadas todas as assinaturas que o mesmo contiver, e cada uma ter?? um resultado de valida????o pr??prio.</Typography>
							</AccordionDetails>
						</Accordion>
					)}
					{language === "en" ? (
						<Accordion expanded={selected === 5} onChange={() => this.setState({ selected: selected === 5 ? -1 : 5 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>I have several documents I want to validate. Do I have to enter one by one and check the validation of each?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									No. Despite being a possible scenario, it is not the most efficient one since it is possible to insert one or more documents at once, and all will be validated and displayed on the user's screen.
								</Typography>
							</AccordionDetails>
						</Accordion>
					) : (
						<Accordion expanded={selected === 5} onChange={() => this.setState({ selected: selected === 5 ? -1 : 5 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>Tenho v??rios documentos que pretendo validar. Tenho que inserir um a um e verificar a valida????o de cada?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									N??o. Apesar de ser um cen??rio poss??vel, n??o ?? o mais eficaz visto ser poss??vel a inser????o de um ou mais documentos de uma s?? vez, sendo que todos ser??o validados, e apresentados no ecr?? do utilizador.
								</Typography>
							</AccordionDetails>
						</Accordion>
					)}
					{language === "en" ? (
						<Accordion expanded={selected === 6} onChange={() => this.setState({ selected: selected === 6 ? -1 : 6 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>How can I know what motivated the status assigned to each signature?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<div className="w-100 d-flex justify-content-center">
									<img src={Img1} alt="img1" style={{ maxHeight: "100%", maxWidth: "min(100%, 1000px" }} className="mb-3" />
								</div>
								<Typography>
									From the selectable detailed report, as shown in the figure above, you can see which validations are carried out on the signature and in which validation/validations the signature had a problem.
								</Typography>
								<div className="w-100 d-flex justify-content-center">
									<img src={Img2} alt="img1" style={{ maxHeight: "100%", maxWidth: "min(100%, 1000px" }} className="mt-3" />
								</div>
							</AccordionDetails>
						</Accordion>
					) : (
						<Accordion expanded={selected === 6} onChange={() => this.setState({ selected: selected === 6 ? -1 : 6 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>Como posso saber o que motivou o estado atribu??do a cada assinatura?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<div className="w-100 d-flex justify-content-center">
									<img src={Img1} alt="img1" style={{ maxHeight: "100%", maxWidth: "min(100%, 1000px" }} className="mb-3" />
								</div>
								<Typography>
									A partir do relat??rio detalhado, selecion??vel como demonstrado na figura acima, pode observar quais as valida????es que s??o efetuadas sobre a assinatura, e em qual/quais valida????o/valida????es a assinatura acusou algum
									problema.
								</Typography>
								<div className="w-100 d-flex justify-content-center">
									<img src={Img2} alt="img1" style={{ maxHeight: "100%", maxWidth: "min(100%, 1000px" }} className="mt-3" />
								</div>
							</AccordionDetails>
						</Accordion>
					)}
					{language === "en" ? (
						<Accordion expanded={selected === 7} onChange={() => this.setState({ selected: selected === 7 ? -1 : 7 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>How is the certificate used in signatures validated?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									It is verified if the certificate comes from a source included in different trust lists (EU and Portugal). On these lists are made different validations to see if they are valid and as current as possible.
									<br />
									<br />
									The validity of the certificate at the date of signature is also verified.
								</Typography>
							</AccordionDetails>
						</Accordion>
					) : (
						<Accordion expanded={selected === 7} onChange={() => this.setState({ selected: selected === 7 ? -1 : 7 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>Como ?? feita a valida????o do certificado que ?? usado nas assinaturas?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									?? verificado se o certificado ?? proveniente de uma fonte inclu??da em diferentes listas de confian??a (UE e Portugal). Sobre estas listas s??o feitas diferentes valida????es, para perceber se as mesmas s??o v??lidas e o
									mais atuais poss??vel.
									<br />
									<br />?? tamb??m verificada a validade do certificado ?? data da assinatura.
								</Typography>
							</AccordionDetails>
						</Accordion>
					)}
					{language === "en" ? (
						<Accordion expanded={selected === 8} onChange={() => this.setState({ selected: selected === 8 ? -1 : 8 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>What are the rules that manage signature validation?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>The DigitalSign validator must comply with criteria imposed by the eIDAS regulation, which is based on ETSI technical standards, which serve as a basis for service audits.</Typography>
							</AccordionDetails>
						</Accordion>
					) : (
						<Accordion expanded={selected === 8} onChange={() => this.setState({ selected: selected === 8 ? -1 : 8 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>Quais as regras que gerem a valida????o de assinaturas?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>O validador da DigitalSign tem que obedecer a crit??rios impostos pelo regulamento eIDAS, que se apoia em normas t??cnicas ETSI, as quais servem de base para auditorias realizadas ao servi??o.</Typography>
							</AccordionDetails>
						</Accordion>
					)}
					{language === "en" ? (
						<Accordion expanded={selected === 9} onChange={() => this.setState({ selected: selected === 9 ? -1 : 9 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>Why do I need to validate signatures on a document?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									The electronic signature or seal does not guarantee itself that the document was signed by a reputable entity. Thus, it is extremely important to validate signatures to ensure the integrity of electronically signed
									documents, as well as the validity of electronic signatures or seals.
								</Typography>
							</AccordionDetails>
						</Accordion>
					) : (
						<Accordion expanded={selected === 9} onChange={() => this.setState({ selected: selected === 9 ? -1 : 9 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>Porque necessito de validar as assinaturas de um documento?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									A assinatura ou selo eletr??nico n??o garante por si s?? que o documento foi assinado por uma entidade fidedigna. Assim, ?? extremamente importante validar as assinaturas, para garantir a integridade de documentos
									assinados eletronicamente, assim como a validade das assinaturas ou selos eletr??nicos.
								</Typography>
							</AccordionDetails>
						</Accordion>
					)}
					{language === "en" ? (
						<Accordion expanded={selected === 10} onChange={() => this.setState({ selected: selected === 10 ? -1 : 10 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>What is the validation report?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									A validation report is a document that demonstrates the results of the carried out validation, which can be used as proof that the signatures and seals present in a document were valid from the date of its creation
									until the moment the validation was carried out.
								</Typography>
							</AccordionDetails>
						</Accordion>
					) : (
						<Accordion expanded={selected === 10} onChange={() => this.setState({ selected: selected === 10 ? -1 : 10 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>O que ?? o relat??rio de valida????o?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>
									Um relat??rio de valida????o ?? um documento que demonstra os resultados provenientes da valida????o efetuada, o qual pode ser usado como prova de que as assinaturas e selos presentes num documento eram v??lidas ?? data da
									sua cria????o, at?? ao momento em que foi realizada a valida????o.
								</Typography>
							</AccordionDetails>
						</Accordion>
					)}
					{language === "en" ? (
						<Accordion expanded={selected === 11} onChange={() => this.setState({ selected: selected === 11 ? -1 : 11 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>How is the validation of each document that I put to validate made ?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<div className="w-100 d-flex justify-content-center">
									<img src={Img3} alt="img1" style={{ maxHeight: "100%", maxWidth: "min(100%, 1000px" }} />
								</div>
							</AccordionDetails>
						</Accordion>
					) : (
						<Accordion expanded={selected === 11} onChange={() => this.setState({ selected: selected === 11 ? -1 : 11 })}>
							<AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
								<Typography>
									<b>Como ?? feita a valida????o de cada documento que coloco para validar?</b>
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<div className="w-100 d-flex justify-content-center">
									<img src={Img3} alt="img1" style={{ maxHeight: "100%", maxWidth: "min(100%, 1000px" }} />
								</div>
							</AccordionDetails>
						</Accordion>
					)}
				</DialogContent>
			</Fragment>
		);
	}
}
