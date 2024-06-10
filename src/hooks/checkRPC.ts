export const checkRPCCompatibility = async (
  rpcUrl: string,
  expectedChainId: number
) => {
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1,
      }),
    });

    if (!response.ok) {
      // throw new Error(
      //   `RPC server error: ${response.status} ${response.statusText}`
      // );
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      const chainId = parseInt(data.result, 16);
      return chainId === expectedChainId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (jsonError: any) {
      // throw new Error(`Error parsing JSON response: ${jsonError.message}`);
    }
  } catch (error) {
    // console.error("Error checking RPC compatibility:", error);
    return false;
  }
};

export async function findCompatibleRPC(
  rpcUrls: string[],
  expectedChainId: number = 7000
): Promise<string> {
  for (const rpcUrl of rpcUrls) {
    if (await checkRPCCompatibility(rpcUrl, expectedChainId)) {
      return rpcUrl; // Return the first compatible RPC URL
    }
  }
  throw new Error("No compatible RPC URL found."); // Throw an error if no compatible RPC is found
}

// Usage example
// const rpcUrl = 'https://example-rpc.com';
// const expectedChainId = 1; // Replace with the expected chain ID
// checkRPCCompatibility(rpcUrl, expectedChainId)
//     .then(isCompatible => {
//         if (isCompatible) {
//             console.log('The RPC URL is compatible with the chain ID.');
//         } else {
//             console.log('The RPC URL is not compatible with the chain ID.');
//         }
//     });
