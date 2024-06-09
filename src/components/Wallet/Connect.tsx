import { Button } from "antd";
import { SiWalletconnect } from "react-icons/si";

const Connect = () => {
    return (
        <Button className="btn-bg duration-500 group" type="primary" icon={<SiWalletconnect className="text-xl group-hover:animate-bounce" />} >
            Connect Wallet
        </Button>
    )
}

export {
    Connect as CustomConnect
};