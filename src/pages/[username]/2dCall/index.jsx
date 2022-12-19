import styles from "../../../styles/2dCall.module.css";
import Layout from "../../../components/layout/layout";
import Table from "../../../components/customTable/table";
import Thead from "../../../components/customTable/tHead";
import Th from "../../../components/customTable/th";
import Tr from "../../../components/customTable/tr";
import Tbody from "../../../components/customTable/tBody";
import Td from "../../../components/customTable/td";
import { getSession, useSession } from "next-auth/react";
import useSWR from "swr";
import { useRouter } from "next/router";
import Button from "../../../components/button/button";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Image from "next/image";
let socket;

export default function TwoDCall() {
  const [show, setShow] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const [recipient, setRecipient] = useState();
  const [userData, setUserData] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isSelected, setIsSelected] = useState();
  const [isBgSelected, setIsBgSelected] = useState();
  const [isModelSelected, setIsModelSelected] = useState();
  const router = useRouter();
  const { username } = router.query;
  const { data: session, status } = useSession();

  let uid = isSelected;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error } = useSWR(`/api/${username}/getPatients`, fetcher);

  const { data: backgroundImages, error: backgroundImagesError } = useSWR(
    `/api/${username}/getBackgrounds/${userData?.id}`,
    fetcher
  );

  const { data: models, error: modelsError } = useSWR(
    `/api/${username}/getModels/${userData?.id}`,
    fetcher
  );

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

  useEffect(() => {
    socketInitializer();
    setUserData(JSON.parse(localStorage.getItem("userData")));
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("inComingCallResponse", (msg) => {
      const payload = JSON.parse(msg);

      console.log(payload.uid);

      if (payload.isAccepted === true) {
        setCallStatus("Call Connected...");
        setTimeout(() => {
          router.push(
            `/${username}/2dCall/${payload.roomName}?uid=${payload.uid}`
          );
        }, 1000);
      } else if (payload.isAccepted === false) {
        setCallStatus("Call Declined...");
        setTimeout(callDeclined, 1000);
      }
    });

    socket.on("congratsRes", (msg) => {
      const payload = JSON.parse(msg);

      console.log(payload);
    });
  };

  const callDeclined = () => {
    setShow(false);
    setRecipient();
  };

  const handleAction = async (e, f, g) => {
    if (isSelected == e) {
      setIsSelected();
    } else {
      setIsSelected(e);
    }
  };

  const handleBackGroundSelect = (e) => {
    if (isBgSelected) {
      setIsBgSelected(e);
    } else {
      setIsBgSelected(e);
    }
  };

  const handleModelImageSelect = (e) => {
    if (isBgSelected) {
      setIsModelSelected(e);
    } else {
      setIsModelSelected(e);
    }
  };

  const handleCreateSession = async () => {
    const randomName = makeid(6);
    const payload = JSON.stringify({
      userId: isSelected,
      callType: "2d",
      callerName: session.user.name,
      callerImage: session.user.image,
      roomName: randomName,
      backgroundImagesUrl: isBgSelected.backgroundImageUrl,
      modelUrl: isModelSelected.modelUrl,
    });
    setShow(true);
    setCallStatus("Connecting...");
    socket.emit("createdMessage", payload);
  };

  return (
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
            <span className="badge bg-dark">2-D Call</span>
          </div>
        )}
      </Modal>
      {data && (
        <div className={`${styles.selectContainer2d} container-fluid`}>
          <div className="row">
            <div className={`${isSelected ? "col-lg-6" : "col-lg-12"}`}>
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
                              title={
                                isSelected == item.id ? "Unselect" : "Select"
                              }
                              style={
                                isSelected == item.id
                                  ? styles.actionBtnSelected
                                  : styles.actionBtn
                              }
                              handleClick={() => {
                                setRecipient({
                                  id: item.id,
                                  name: item.name,
                                  image: item.image,
                                });
                                handleAction(item.id, item.name, item.image);
                              }}
                            />
                          }
                        />
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            </div>
            {isSelected && (
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-6">
                    <div
                      className={`container-fuild ${styles.backgroundImage}`}
                    >
                      {backgroundImages.map((item, index) => (
                        <Image
                          key={index}
                          className={`img-responsive ${
                            isBgSelected?.backgroundImagesId == item.id &&
                            styles.backgroundImageActive
                          }`}
                          alt="Background Image"
                          width={180}
                          height={100}
                          src={`${item.imageUrl}`}
                          unoptimized
                          priority={true}
                          onClick={() =>
                            handleBackGroundSelect({
                              backgroundImagesId: item.id,
                              backgroundImageUrl: item.imageUrl,
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div
                      className={`container-fuild ${styles.backgroundImage}`}
                    >
                      {models.map((item, index) => (
                        <Image
                          key={index}
                          className={`img-responsive ${
                            isModelSelected?.modelId == item.id &&
                            styles.backgroundImageActive
                          }`}
                          alt="Background Image"
                          width={120}
                          height={180}
                          src={`${item.imageUrl}`}
                          unoptimized
                          priority={true}
                          onClick={() =>
                            handleModelImageSelect({
                              modelId: item.id,
                              modelUrl: item.modelUrl,
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {isBgSelected && isModelSelected && (
                  <Button
                    style={styles.createSessionBtn}
                    title="Create Session"
                    handleClick={handleCreateSession}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
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
