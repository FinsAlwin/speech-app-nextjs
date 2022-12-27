import { getSession, useSession, signOut } from "next-auth/react";
import useSWR from "swr";
import Profile from "../../components/profile";
import { useRouter } from "next/router";
import Head from "next/head";
import Therapist from "./../../components/therapist/index";
import Patient from "./../../components/patient/index";
import Layout from "../../components/layout/layout";
import { useEffect, useState } from "react";
import PushNotificationLayout from "../../components/PushNotificationLayout";
import { onMessageListener, getToken } from "../../utils/firebase";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home(props) {
  const [isTokenFound, setTokenFound] = useState(false);
  const router = useRouter();
  const { username } = router.query;

  const { data: session, status } = useSession();

  const { data, error } = useSWR(`/api/${username}`, fetcher);

  useEffect(() => {
    let fcmData;

    async function tokenFunc() {
      if (data && data.fcmToken) {
        localStorage.setItem("userData", JSON.stringify(data));
      } else {
        fcmData = await getToken(setTokenFound);
        await setFcm(fcmData);
      }
      return fcmData;
    }

    tokenFunc();
  }, [setTokenFound]);

  const setFcm = async (fcmToken) => {
    const payload = {
      fcmToken: fcmToken,
    };

    const res = await fetch(`/api/${session.user.email}/setFcmToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const dataRes = await res.json();

    if (res.status == 200) {
      localStorage.setItem("userData", JSON.stringify(dataRes.data));
    }
  };

  return (
    <PushNotificationLayout>
      <Layout>
        <div>
          <Head>
            <title>{username}</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>

          {data && (
            <>
              {data?.userType && (
                <>
                  {data.userType == 1 && <Therapist />}
                  {data.userType == 2 && <Patient />}
                </>
              )}

              {!data?.userType && (
                <Profile data={session} userType={data?.userType} />
              )}
            </>
          )}
        </div>
      </Layout>
    </PushNotificationLayout>
  );
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
