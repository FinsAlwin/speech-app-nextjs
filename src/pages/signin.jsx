import styles from "../styles/Login.module.css";
import { FcGoogle } from "react-icons/fc";
import LoginButton from "../components/button/LoginButton";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

export default function Login(props) {
  const handleLogin = () => {
    signIn("google");
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

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: `/${session.user.email}`,
      },
    };
  }

  return {
    props: { session },
  };
};
