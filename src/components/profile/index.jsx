import Image from "next/image";
import styles from "../../styles/Profile.module.css";
import { BiLogInCircle } from "react-icons/bi";
import { signOut } from "next-auth/react";
import Button from "../button/button";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

export default function Profile({ data, userType }) {
  const router = useRouter();

  const handleSelect = async (e) => {
    const payload = {
      userType: e.target.value,
    };

    const res = await fetch(`/api/${data.user.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const dataRes = await res.json();

    if (res.status == 200) {
      toast.success(dataRes.message);
      router.reload();
    }
  };

  const handleLogOut = () => {
    signOut();
  };
  return (
    <>
      {data && (
        <div className={`container mt-5 ${styles.profileContainer}`}>
          <div className={`card shadow ${styles.profileCard} rounded`}>
            &nbsp;
            <div className={`${styles.imageContainerProfile} shadow-lg`}>
              <Image
                className={`${styles.imageCustom}`}
                alt="Picture of the user"
                width={80}
                height={80}
                src={data.user.image}
                unoptimized={true}
                priority={true}
              />
            </div>
            &nbsp;
            <h4>{data.user.name}</h4>
            <h5>{data.user.email}</h5>
            {!userType && (
              <select
                className="form-select form-select-lg mb-3 shadow"
                aria-label=".form-select-lg example"
                onChange={handleSelect}
              >
                <option defaultValue>Select User Type</option>
                <option value={1}>Therapist</option>
                <option value={2}>Patient</option>
              </select>
            )}
            <Button
              title={"Sign Out"}
              style={`${styles.logOutBtn} shadow`}
              icon={<BiLogInCircle size={20} />}
              handleClick={handleLogOut}
            />
            &nbsp;
          </div>
        </div>
      )}
    </>
  );
}
