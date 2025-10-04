import DashboardPage from "./page";
import { Suspense } from "react";
import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

const DashboardLayout = () => {
  return (
    <div className={"px-5"}>
      <Suspense
        fallback={
          <div
            className={"fixed inset-0 z-50 flex items-center justify-center"}
          >
            <Quantum size="45" speed="1.75" color="black" />
          </div>
        }
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
};
export default DashboardLayout;
