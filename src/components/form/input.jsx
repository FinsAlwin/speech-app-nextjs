export default function Input(props) {
  const handleChange = (e) => {
    props.onChange(e.target.value);
  };

  return (
    <>
      <div className="form-group shadow-lg">
        <input
          value={props.value}
          type={props.type}
          className="form-control"
          placeholder={props.placeholder}
          required={props.required}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
    </>
  );
}
