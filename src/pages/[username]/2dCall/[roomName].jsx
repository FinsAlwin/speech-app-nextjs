import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import TwoDCallPatient from "../../../components/TwoD/patient";
import TwoDCallTherapist from "../../../components/TwoD/therapist";
import Head from "next/head";

export default function TwoDSession() {
  const [userData, setUserData] = useState();
  const [isMounted, setIsMounted] = useState(false);

  const { data: session, status } = useSession();
  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userData")));
    setIsMounted(true);
  }, []);

  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title>Speech App | 2D Call</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div className="container-fluid">
          {userData && isMounted && (
            <>
              {userData.userType === 1 && <TwoDCallTherapist />}
              {userData.userType === 2 && <TwoDCallPatient />}
            </>
          )}
        </div>
      </>
    );
  }
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: `/signin`,
      },
    };
  }

  return {
    props: { session },
  };
};
