import React from "react"
import Navbar from "./Navigation/Navbar"
import Footer from "./Navigation/Footer"

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="min-h-screen app-bg text-white overflow-hidden">
                <Navbar  />
                <div className="pt-16 md:pt-24 px-5 md:px-10">
                    {children}
                </div>
                <Footer />
            </div>
        </>
    )
}
