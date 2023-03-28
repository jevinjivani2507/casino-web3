import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { CustomButton } from "./";
import { logo, sun, menu, search, thirdweb } from "../assets";
import { navlinks } from "../constants";
import Image from "next/image";

import { useStateContext } from "../context";

import { shortenAddress } from "../utils";

import coins from "../assets/Coins.svg";

export const Navbar = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { currentAccount, connectWallet } = useStateContext();

  const handleSearchClick = () => {
    router.push(
      {
        // pathname: "/Search",
        query: { search: searchValue },
      },
      `/search?=${searchValue}`
    );
  };

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input
          type="text"
          placeholder="Search for campaigns"
          className="flex mt-1 w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <div
          className="w-[72px] h-full rounded-[20px] bg-primary flex justify-center items-center cursor-pointer"
          onClick={handleSearchClick}
        >
          <Image
            src={search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      </div>
      <div className="sm:flex hidden flex-row justify-end gap-4">
        {currentAccount && (
          <div className="flex gap-2 items-center">
            <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
              200
            </h1>
            <Image src={coins} alt="fund_logo" className="" />
          </div>
        )}
        <CustomButton
          btnType="button"
          title={currentAccount ? shortenAddress(currentAccount) : "Connect"}
          styles={currentAccount ? "bg-primary" : "bg-secondary"}
          handleClick={() => {
            if (currentAccount) console.log("You're Connected!!") // router.push("/CreateCampaign");
            else connectWallet();
          }}
        />
      </div>
      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-background flex justify-center items-center cursor-pointer">
          <Image
            src={logo}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>

        <Image
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-background z-10 shadow-shadowSecondary py-4 ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  router.push(link.link);
                }}
              >
                <Image
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={currentAccount ? "Create a campaign" : "Connect"}
              styles={currentAccount ? "bg-primary" : "bg-secondary"}
              handleClick={() => {
                if (currentAccount) router.push("CreateCampaign");
                else connect();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// export default Navbar;
