import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import styles from "../../styles/NavBar.module.css";
import Link from "next/link";
import Image from "next/image";
import Button from "../button/button";
import { BiLogInCircle } from "react-icons/bi";

export default function NavBar() {
  const [drawer, setDrawer] = useState(false);

  const handleDrawer = () => {
    if (drawer) {
      setDrawer(false);
    } else {
      setDrawer(true);
    }
  };

  const { data: session, status } = useSession();

  const handleLogOut = () => {
    signOut();
  };
  return (
    <>
      {session && (
        <>
          <nav className={`navbar navbar-expand-lg ${styles.navBar} shadow`}>
            <div className="container-fluid d-flex">
              <div className={`${styles.logo} shadow`}>
                <Link href="/">Speech-App</Link>
              </div>
              <div className={`${styles.profile} `}>
                <div
                  className={`${styles.avatarContainer}`}
                  onClick={handleDrawer}
                >
                  <Image
                    className={`${styles.avatarImage} shadow-lg`}
                    alt="Picture of the user"
                    width={40}
                    height={40}
                    src={session.user.image}
                    unoptimized
                    priority
                  />
                </div>
              </div>
            </div>
          </nav>

          <div
            className={`${styles.drawerContainer} ${
              drawer && styles.slider
            } shadow-lg`}
          >
            <div className={`card shadow ${styles.profileCard} rounded`}>
              <div className={`${styles.imageContainerProfile} shadow-lg`}>
                <Image
                  className={`${styles.imageCustom}`}
                  alt="Picture of the user"
                  width={80}
                  height={80}
                  src={session.user.image}
                  unoptimized
                  priority
                />
              </div>
              &nbsp;
              <h4>{session.user.name}</h4>
              <h5>{session.user.email}</h5>
              &nbsp;
              <Button
                title={"Sign Out"}
                style={`${styles.logOutBtn} shadow`}
                icon={<BiLogInCircle size={20} />}
                handleClick={handleLogOut}
              />
              &nbsp;
            </div>
          </div>
        </>
      )}
    </>
  );
}
