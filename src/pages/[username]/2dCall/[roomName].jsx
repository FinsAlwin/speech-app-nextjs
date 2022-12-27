import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import TwoDCallPatient from "../../../components/TwoD/patient";
import TwoDCallTherapist from "../../../components/TwoD/therapist";
import Head from "next/head";
import PushNotificationLayout from "../../../components/PushNotificationLayout";

export default function TwoDSession() {
  const [userData, setUserData] = useState();
  const [isMounted, setIsMounted] = useState(false);
  const [reinforcement, setReinforcement] = useState(false);

  const { data: session, status } = useSession();
  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userData")));
    setIsMounted(true);
  }, []);

  const handlereinforcement = async (e) => {
    setReinforcement(e);
  };

  useEffect(() => {
    if (reinforcement) {
      setTimeout(() => {
        setReinforcement(false);
      }, 10000);
    }
  }, [reinforcement]);

  if (status === "authenticated") {
    return (
      <>
        <PushNotificationLayout handlereinforcement={handlereinforcement}>
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
                {userData.userType === 2 && (
                  <TwoDCallPatient reinforcement={reinforcement} />
                )}
              </>
            )}
          </div>
        </PushNotificationLayout>
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
