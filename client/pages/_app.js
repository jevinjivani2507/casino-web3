import "../styles/globals.css";
import { Navbar } from "../components/Navbar";

import { StateContextProvider } from "../context";

const App = ({ Component, pageProps }) => {
  return (
    <StateContextProvider>
      <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </div>
    </StateContextProvider>
  );
};

export default App;
