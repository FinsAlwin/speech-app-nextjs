export default function Button(props) {
  const handleClick = (e) => {
    props.handleClick();
  };

  return (
    <button className={`btn ${props.style}`} onClick={handleClick}>
      <i>{props.icon}</i> {props.title && <> &nbsp;{props.title}</>}
    </button>
  );
}
