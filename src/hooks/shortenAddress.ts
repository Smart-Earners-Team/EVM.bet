export const shortenAddress = (address: string, digits: number = 5): string => {
    if (!address) return '';
    const str = `${address.substring(0, digits + 2)}...${address.substring(address.length - digits)}`;
    return str;
};