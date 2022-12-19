import styles from "../../styles/Login.module.css";
import { FcGoogle } from "react-icons/fc";
import LoginButton from "../button/LoginButton";

export default function Login(props) {
  const handleLogin = () => {
    props.click();
  };
  return (
    <div className={`${styles.loginBox} rounded shadow-lg`}>
      <LoginButton
        icon={<FcGoogle size={20} />}
        title={"Sign in with Google"}
        handleClick={handleLogin}
      />
    </div>
  );
}
