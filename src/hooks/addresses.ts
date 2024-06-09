type AddressType = {
    [ key : number ] : string; // This is the string index signature
};

export const addresses = {
    lottery: <AddressType> {
        128123: "0x2B6Aa77f23d7fC14161E540beFDfAE5e67eFb25d",
    },
    randomizer: <AddressType> {
        128123: "0xCFB024DE4bD45700d53d91CDdF7836348DA3c8CC",
    },
}