import { useSession } from "next-auth/react";
export default function Footer() {
  const { data: session } = useSession();
  return (
    <>
      {session && (
        <div className="container-fluid">
          <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 ">
            <div className="col-md-4 d-flex align-items-center">
              <span className="mb-3 mb-md-0 text-muted">
                &copy; 2022 Parel, Inc
              </span>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
