type AddressType = {
    [ key : number ] : string; // This is the string index signature
};

export const addresses = {
    lottery: <AddressType> {
        9768: "0xFbf681a9515A61be2cA3E75db83e15749A1907E9",
        // 128123: "0x2B6Aa77f23d7fC14161E540beFDfAE5e67eFb25d",
        // 128123: "0xd820a73F78c47Ab06e7d6624e7d081ff35a2b9Ec"
        // 128123: "0x68B5E924DDDdA92dEA7F38f8dCB3386d4854c18F"
        128123: "0xC1D2eB15b09dE06d1c70559963B731D2f2965d82"
    },
    randomizer: <AddressType> {
        9768: "",
        // 128123: "0xCFB024DE4bD45700d53d91CDdF7836348DA3c8CC",
        // 128123: "0x66053BDDA8FAB5E664858FD87B2e158258Cba3c2" 
        // 128123: "0x8b657bdbb185F7921d6bE08032Ac2ce2039a8481"  
        128123: "0xC670060dED5057fBeC4D55cCd4446901A3E6E3f0"       
    },
    
}