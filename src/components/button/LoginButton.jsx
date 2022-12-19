export default function LoginButton(props) {
  const handleClick = (e) => {
    props.handleClick();
  };

  return (
    <button className="btn btn-outline-light" onClick={handleClick}>
      <i>{props.icon}</i> &nbsp; {props.title}
    </button>
  );
}
