import PropTypes from "prop-types";

function PrimaryButton({
  buttonType,
  buttonName,
  buttonTextColor,
  buttonBGColor,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type={buttonType}
      className={`px-5 py-2 font-bold font-roboto ${buttonTextColor} ${buttonBGColor} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
      disabled={disabled}
      onClick={onClick}
    >
      {buttonName}
    </button>
  );
}

PrimaryButton.propTypes = {
  buttonType: PropTypes.string,
  buttonName: PropTypes.string,
  buttonTextColor: PropTypes.string,
  buttonBGColor: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default PrimaryButton;