import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { Navbar } from "./components/Navbar";
import TopBar from "./components/TopBar";

import { QueryProvider, PolarisProvider } from "./components";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <BrowserRouter>
        <QueryProvider>
          <div className="main-section flex h-screen w-full overflow-hidden bg-[#f6f6f7]">
            <div className="menu-section h-full">
              <Navbar />
            </div>
            <div className="contentsection flex-1 overflow-y-auto">
              <TopBar />
              <Routes pages={pages} />
            </div>
          </div>
        </QueryProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
