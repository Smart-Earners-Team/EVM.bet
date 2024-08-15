import React, { useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer, Button } from "antd";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Link, useLocation } from "react-router-dom";
import { CustomConnect } from "../Wallet/Connect";
import { PiCaretRight } from "react-icons/pi";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";

const evmbetLogo = "/logo.png";

const topNavItems = [
  {
    id: 0,
    title: "Games",
    href: "",
    target: "",
    children: [
      {
        id: 0.1,
        title: "Trophy",
        href: "/trophy",
        target: "",
      },
    ],
  },
  { id: 1, title: "Dashboard", href: "/dashboard", target: "" },
] as {
  id: number;
  title: string;
  href: string;
  target: string;
  children?: {
    id: number;
    title: string;
    href: string;
    target: string;
  }[];
}[];

const Navbar: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showNav, setShowNav] = useState<boolean>(false);

  const toggleNav = () => setShowNav(!showNav);

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const handleMouseEnter = (index: number) => {
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleClickNav = (index: number) => {
    activeDropdown !== null
      ? setActiveDropdown(null)
      : setActiveDropdown(index);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <button
        onClick={toggleNav}
        className="z-10 outline-none fixed top-1/3 left-1 select-none text-xl bg-slate-50/10 hover:pl-3 p-1 duration-500 rounded-r-full"
      >
        <PiCaretRight className={"hover:scale-105 duration-300"} />
      </button>

      <div className="md:px-32 px-5 fixed z-50 w-full bg-transparent backdrop-blur py-1 mt-3 text-sm">
        <div className="flex justify-between items-center px-5">
          <div className="flex gap-x-1 select-none w-fit">
            <Link
              to={"/"}
              children={
                <div className="flex items-center">
                  <img
                    src={evmbetLogo}
                    width={60}
                    alt="EVM.bet Logo"
                    className="my-auto cursor-pointer"
                  />
                  <span className="md:block text-white text-xs">
                    <span className="text-gradient text-xl font-bold -tracking-wide">
                      EVM.
                    </span>
                    bet
                  </span>
                </div>
              }
            />
          </div>

          <ul className="hidden md:flex md:py-3 md:gap-3">
            {topNavItems.map((val, i) => {
              if (val.children) {
                return (
                  <li
                    className="relative"
                    key={i}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <a
                      // href={val.href}
                      // target={val.target}
                      className={`${
                        val.href === currentPath
                          ? "border-b-2 border-cyan-500"
                          : ""
                      } first-line:px-4 py-3 text-inherit cursor-pointer tracking-wide hover:text-cyan-500 duration-500 flex w-fit gap-1 items-center`}
                    >
                      <span>{val.title}</span>
                      {activeDropdown !== null && activeDropdown === i ? (
                        <FaCaretDown />
                      ) : (
                        <FaCaretRight />
                      )}
                    </a>
                    {val.children && activeDropdown === i && (
                      <div className="absolute top-[85%] -left-1/2 grid bg-white shadow-2xl text-cyan-900 z-10">
                        {val.children.map((child, index) => (
                          <a
                            key={index}
                            href={child.href}
                            target={child.target}
                            className="px-5 py-2 duration-500 whitespace-nowrap hover:bg-cyan-800 hover:text-cyan-50"
                          >
                            {child.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                );
              }
              return (
                <li key={i}>
                  <a
                    href={val.href}
                    target={val.target}
                    className={`${
                      val.href === currentPath && "border-b-2 border-cyan-500"
                    } first-line:px-4 py-3 text-inherit cursor-pointer block w-full tracking-wide hover:text-cyan-500 duration-500`}
                  >
                    {val.title}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:flex md:py-3 md:gap-3">
            <CustomConnect />
          </div>
        </div>

        <Drawer
          placement="left"
          closable={false}
          onClose={toggleNav}
          open={showNav}
          key="right"
          width={isMobile ? "100%" : "30%"}
          className="relative"
        >
          <ul className="space-y-4 duration-300 relative z-10">
            <div className="flex justify-between items-center gap-x-1 col-span-2 cursor-pointer select-none w-full">
              <Link
                to={"/"}
                children={
                  <div className="flex items-center">
                    <img
                      src={evmbetLogo}
                      width={60}
                      alt="EVM.bet Logo"
                      className="my-auto cursor-pointer"
                    />
                    <span className="md:block text-inherit text-xs">
                      <span className="text-gradient text-xl font-bold -tracking-wide">
                        EVM.
                      </span>
                      bet
                    </span>
                  </div>
                }
              />
              <Button
                type="text"
                icon={<CloseOutlined className="text-xl" />}
                onClick={toggleNav}
              />
            </div>
            <hr className="border-b-1 my-1" />
            {topNavItems.map((val, i) => {
              if (val.children) {
                return (
                  <li
                    className="relative"
                    key={i}
                    onClick={() => {
                      handleClickNav(i);
                    }}
                  >
                    <a
                      // href={val.href}
                      // target={val.target}
                      className={`${
                        val.href === currentPath
                          ? "border-b-2 border-cyan-500"
                          : ""
                      } first-line:px-4 py-3 text-inherit cursor-pointer tracking-wide hover:text-cyan-500 duration-500 flex w-fit gap-1 items-center`}
                    >
                      <span>{val.title}</span>
                      {activeDropdown !== null && activeDropdown === i ? (
                        <FaCaretDown />
                      ) : (
                        <FaCaretRight />
                      )}
                    </a>
                    {val.children && activeDropdown === i && (
                      <div className="z-50 grid left-1/2">
                        {val.children.map((child, index) => (
                          <a
                            key={index}
                            href={child.href}
                            target={child.target}
                            className="px-5 py-2 duration-500 whitespace-nowrap hover:bg-cyan-800 hover:text-cyan-50"
                          >
                            {child.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                );
              }
              return (
                <li key={i}>
                  <a
                    href={val.href}
                    target={val.target}
                    className={`${
                      val.href === currentPath && "border-b-2 border-cyan-500"
                    } first-line:px-4 py-3 text-inherit cursor-pointer block w-full tracking-wide hover:text-cyan-500 duration-500`}
                  >
                    {val.title}
                  </a>
                </li>
              );
            })}
            <div className="flex md:py-3 md:gap-3 items-center">
              <CustomConnect />
            </div>
          </ul>

          <Canvas className="absolute -top-2/3 w-full h-full z-0">
            <OrbitControls enableZoom={false} />
            <Stars />
          </Canvas>
        </Drawer>
      </div>
    </>
  );
};

export default Navbar;
