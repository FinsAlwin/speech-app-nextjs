import { getSession, useSession, signOut } from "next-auth/react";
import useSWR from "swr";
import Profile from "../../components/profile";
import { useRouter } from "next/router";
import Head from "next/head";
import Therapist from "./../../components/therapist/index";
import Patient from "./../../components/patient/index";
import Layout from "../../components/layout/layout";
import { useEffect, useState } from "react";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home(props) {
  const router = useRouter();
  const { username } = router.query;

  const { data: session, status } = useSession();

  const { data, error } = useSWR(`/api/${username}`, fetcher);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(data));
  }, [data]);

  return (
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
