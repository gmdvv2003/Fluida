import "./Backdrop.css";

const Backdrop = ({ show, onClick }) => {
	return show ? <div className="backdrop" onClick={onClick}></div> : null;
};

export default Backdrop;
