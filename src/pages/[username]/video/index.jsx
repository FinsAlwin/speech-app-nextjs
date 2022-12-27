/* eslint-disable */
import styles from "../../../styles/Video.module.css";
import Table from "../../../components/customTable/table";
import Thead from "../../../components/customTable/tHead";
import Th from "../../../components/customTable/th";
import Tr from "../../../components/customTable/tr";
import Tbody from "../../../components/customTable/tBody";
import Td from "../../../components/customTable/td";
import { getSession, useSession } from "next-auth/react";
import Layout from "../../../components/layout/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import Button from "../../../components/button/button";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import PushNotificationLayout from "../../../components/PushNotificationLayout";
import Image from "next/image";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Video() {
  const [show, setShow] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const [recipient, setRecipient] = useState();
  const [userData, setUserData] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const router = useRouter();
  const { username } = router.query;
  const { data: session, status } = useSession();

  const { data, error } = useSWR(`/api/${username}/getPatients`, fetcher);

  useEffect(() => {
    setUserData(localStorage.getItem("userData"));
  });

  const callDeclined = () => {
    setShow(false);
    setRecipient();
  };

  const handleAction = async (e, f, g, h) => {
    const randomName = makeid(6);

    const payload = JSON.stringify({
      to: h,
      priority: "high",
      notification: {
        title: "Call Placed",
        body: "Video Call Request",
      },
      data: {
        userId: e,
        callType: "video",
        callerName: session.user.name,
        callerImage: session.user.image,
        roomName: randomName,
        senderFcmToken: JSON.parse(userData).fcmToken,
      },
    });

    setShow(true);

    setCallStatus("Connecting...");

    setRecipient({ id: e, name: f, image: g });

    await fetch(`https://fcm.googleapis.com/fcm/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY}`,
      },
      body: payload,
    });
  };

  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  return (
    <>
      <PushNotificationLayout>
        <Layout>
          <Modal
            show={show}
            onHide={handleClose}
            animation={true}
            contentClassName={styles.modalContent}
          >
            {recipient && (
              <div className={`${styles.callContainer} card shadow`}>
                <h4>{callStatus}</h4>
                {recipient.image && (
                  <div className={`${styles.imageContainer} shadow-lg`}>
                    <Image
                      className={`${styles.imageCustom}`}
                      alt="Picture of the user"
                      width={80}
                      height={80}
                      src={`${recipient.image}`}
                      unoptimized
                      priority={true}
                    />
                  </div>
                )}
                <h4>{recipient.name}</h4>
                <span className="badge bg-dark">Video Call</span>
              </div>
            )}
          </Modal>
          {data && (
            <div className="container shadow-lg rounded">
              <div className={`${styles.selectContainer}`}>
                <Table>
                  <Thead>
                    <Tr>
                      <Th title="Name" />
                      <Th title="Email" />
                      <Th title="Action" />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.map((item, index) => (
                      <Tr key={index}>
                        <Td title={item.name} />
                        <Td title={item.email} />
                        <Td
                          title={
                            <Button
                              title="Create Session"
                              style={styles.actionBtn}
                              handleClick={() =>
                                handleAction(
                                  item.id,
                                  item.name,
                                  item.image,
                                  item.fcmToken
                                )
                              }
                            />
                          }
                        />
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            </div>
          )}
        </Layout>
      </PushNotificationLayout>
    </>
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
