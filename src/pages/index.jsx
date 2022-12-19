import { getSession } from "next-auth/react";

export default function LandingPage(props) {
  return <div>Landing Page</div>;
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
