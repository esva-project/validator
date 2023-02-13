import enFlag from "../assets/flags/en.png";
import ptFlag from "../assets/flags/pt.png";

export const Languages = {
	en: { id: "en", locale: "en-au", img: enFlag, backendRef: "en-US" },
	pt: { id: "pt", locale: "pt", img: ptFlag, backendRef: "pt-PT" },
};

const Globals = {
	Languages,
};

export default Globals;
