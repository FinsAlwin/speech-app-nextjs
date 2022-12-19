import AppTile from "./appTile";
import { BiGame, BiVideo } from "react-icons/bi";
import { useSession } from "next-auth/react";

export default function Therapist() {
  const { data: session, status } = useSession();
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3 col-md-3 col-sm-6 col-6">
          <AppTile
            icon={<BiVideo size={60} />}
            link={`/${session.user.email}/video`}
          />
        </div>

        <div className="col-lg-3 col-md-3 col-sm-6 col-6">
          <AppTile
            icon={<h4>2D Call</h4>}
            link={`/${session.user.email}/2dCall`}
          />
        </div>
        <div className="col-lg-3 col-md-3 col-sm-6 col-6">
          <AppTile
            icon={<BiGame size={60} />}
            link={`/${session.user.email}`}
          />
        </div>
      </div>
    </div>
  );
}
