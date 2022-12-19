import Layout from "../../../components/layout/layout";
import styles from "../../../styles/3dCall.module.css";
import Table from "../../../components/customTable/table";
import Thead from "../../../components/customTable/tHead";
import Th from "../../../components/customTable/th";
import Tr from "../../../components/customTable/tr";
import Tbody from "../../../components/customTable/tBody";
import Td from "../../../components/customTable/Td";
import { getSession } from "next-auth/react";
import useSWR from "swr";
import { useRouter } from "next/router";
import Button from "../../../components/button/button";
import { useState } from "react";
import { TbSelect } from "react-icons/tb";
import { AiOutlineCloseCircle } from "react-icons/ai";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function ThreeDCall() {
  const [isSelected, setIsSelected] = useState(false);
  const router = useRouter();
  const { username } = router.query;

  const { data, error } = useSWR(`/api/${username}/getPatients`, fetcher);

  const handleAction = async (e) => {
    // if (isSelected) {
    //   setIsSelected(false);
    // } else {
    //   setIsSelected(true);
    // }
    const randomName = makeid(6);
    router.push(`/${username}/3dCall/${randomName}`);
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
    <Layout>
      {data && (
        <div className={`${styles.selectContainer3d} container-fluid`}>
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
                              title={isSelected ? "Unselect" : "Select User"}
                              style={
                                isSelected
                                  ? styles.actionBtnSelected
                                  : styles.actionBtn
                              }
                              handleClick={() => handleAction(item.id)}
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
                  <div className="col-lg-12"></div>
                  <div className="col-lg-12">awlins</div>
                </div>
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
