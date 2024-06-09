import React, { useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer, Button } from "antd";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Link } from "react-router-dom";
import { CustomConnect } from "../Wallet/Connect";
import { PiCaretRight } from "react-icons/pi";

const evmbetLogo = "/logo.png";

const topNavItems = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Services", href: "/services" },
    { title: "Contact", href: "/contact" },
];

const Navbar: React.FC = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showNav, setShowNav] = useState<boolean>(false);

    const toggleNav = () => setShowNav(!showNav);

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
            <button onClick={toggleNav} className="z-10 outline-none fixed top-1/3 left-1 select-none text-xl bg-slate-50/10 hover:pl-3 p-1 duration-500 rounded-r-full">
                <PiCaretRight
                    className={'hover:scale-105 duration-300'}
                />
            </button>

            <div className="md:px-32 px-5 fixed z-50 w-full bg-transparent backdrop-blur py-1 text-sm">
                <div className="flex justify-between items-center px-5">

                    <div className="flex gap-x-1 select-none w-fit">
                        <Link to={'/'} children={
                            <img
                                src={evmbetLogo}
                                width={60}
                                alt="EVM.bet Logo"
                                className="my-auto cursor-pointer"
                            />
                        } />
                    </div>

                    <ul className="hidden md:flex md:py-3 md:gap-3">
                        {topNavItems.map((val, i) => (
                            <li key={i}>
                                <a
                                    href={val.href}
                                    className="px-4 py-3 rounded-md text-inherit cursor-pointer block w-full tracking-wide leading-10 hover:text-purple-500 duration-500"
                                >
                                    {val.title}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="md:flex md:py-3 md:gap-3">
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
                        <div
                            className="flex justify-between items-center gap-x-1 col-span-2 cursor-pointer select-none w-full"
                        >
                            <Link to={'/'} children={<img
                                src={evmbetLogo}
                                width={60}
                                alt="EVM.bet Logo"
                            />} />
                            <Button
                                type="text"
                                icon={<CloseOutlined className="text-xl" />}
                                onClick={toggleNav}
                            />
                        </div>
                        <hr className="border-b-1 my-1" />
                        {topNavItems.map((val, i) => (
                            <li key={i}>
                                <a
                                    href={val.href}
                                    className="px-3 py-2 rounded-md text-inherit font-semibold cursor-pointer block w-full text-cyan-700 transition-colors duration-300"
                                >
                                    {val.title}
                                </a>
                            </li>
                        ))}
                        <div className="flex md:py-3 md:gap-3">
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
