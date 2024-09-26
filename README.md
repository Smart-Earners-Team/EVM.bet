# EVM.bet: Secure, Transparent, and Instant Prize Draws

EVM.bet is a decentralized application (dApp) designed to revolutionize the way online prize draws are conducted. By leveraging cross-chain SecretVRF by the Secret Network, EVM.bet ensures that prize draws are both secure and transparent. Users can enjoy the excitement of instant prize draws, confident that the results are fair and verifiable. Whether you're looking to try your luck or engage in a secure gaming environment, EVM.bet is your go-to platform for an unparalleled experience.

Price feeds for the Lottery Ticket Price and on the frontend UI are gotten from Pragma Feed ETH Oracle.

## How It Works

Users interact with EVM.bet through a user-friendly dApp interface, where they can participate in prize draws by connecting their EVM wallets.

- **Ticket Purchase**: Users purchase tickets through our user friendly UI at EVM.bet or directly from the blockchain through our EVM-compatible smart contracts. Each sold ticket both increases the prize pool, and lowers the odds of an individual ticket winning. Each transaction is recorded on the blockchain, ensuring transparency.
- **Cross-Chain Interaction**: The close of a lottery round triggers a cross-chain call to the Secret Network, where SecretVRF generates a random number for the prize draw.
- **Confidential Computing**: The Secret Network processes the random number generation and prize draw logic confidentially, ensuring the integrity and privacy of the computation.
- **Result Verification**: The results are sent back to the EVM smart contract, where they are verified and recorded on the blockchain and users can check the transparency of the draw.

### Problem

EVM.bet addresses a critical need in the online gaming and betting industry: the demand for secure, transparent, and confidential prize draws. Traditional online gaming platforms can be easily manipulated, lack transparency and often struggle with issues of fairness and data privacy. This erodes trust and limits the growth potential of the gaming industry. EVM.bet solves these problems by utilizing the Secret Network for confidential computing, ensuring that draw results are tamper-proof.

### Solution

EVM.bet addresses these challenges by offering a decentralized application that leverages cross-chain communication with the Secret Network. Our solution ensures that all prize draws are conducted fairly and transparently. By utilizing SecretVRF (Verifiable Random Function) over SecretPath, we provide verifiable and unpredictable randomness, ensuring the integrity of every draw.

## Product Market Fit

The global online gaming market is projected to grow significantly, and there is a rising demand for secure and transparent gaming platforms. EVM.bet fits perfectly into this market by combining the benefits of blockchain technology with the privacy-preserving features of Secret Network. Our platform caters to a broad audience, from casual gamers to serious enthusiasts, all of whom value fairness and security in gaming. Our target market includes crypto enthusiasts, online gamers, and anyone seeking a trustworthy platform for prize draws.

- **Innovative Technology**: EVM.bet utilizes cutting-edge cross-chain communication and confidential computing.
- **Growing Market**: Positioned in a rapidly expanding online gaming market.
- **Trust and Security**: Offers unmatched transparency and privacy, addressing key concerns of gamers worldwide.
- **Scalable Solution**: Designed to scale with the growing demand for secure online gaming. By connecting with various blockchains, EVM.bet taps into a broader user base across multiple ecosystems.

## Development Deepdive

### Building the Platform:

- **Cross-Chain Communication**: At the core of EVM.bet is the integration with the Secret Network. We use a **RandomnessReceiver** smart contract to call the Secret Network's Gateway Address on our chosen EVM, facilitating secure communication between the Ethereum Virtual Machine (EVM) and Secret Network. This enables us to execute confidential computing tasks off the main chain, ensuring privacy and security. <!-- Secret’s Confidential Computing Layer is live on 20+ blockchain networks, and we plan to gradually add support for most of these chains. -->
- **Solidity Smart Contracts**: We have developed smart contracts on Kakarot Sepolia. The contracts handle user interactions, such as placing bets, and claiming prizes.
- **Confidential Computing**: The use of SecretVRF over SecretPath ensures that all random number generation is both verifiable and confidential. This is critical for maintaining the integrity and fairness of our prize draws.

### Contracts and Functions Interaction:

- **Lottery Contract**: Manages user funds, handles bets, and triggers cross-chain communication for prize draws.
- **RandomnessReceiver Contract**: Executes the prize draw logic using SecretVRF, ensuring randomness and confidentiality.

### Design Choices:

- **Security First**: By leveraging Secret Network’s confidential computing capabilities, we ensure that prize draw operations are secure and private.
- **Transparency and Trust**: Using SecretVRF guarantees that the randomness in prize draws is verifiable, building trust among users. To maintain user trust, all interactions and results are logged on-chain, and users can independently verify the fairness of the prize draws.
- **User Experience**: The user interface is built to be seamless and intuitive, providing users with a smooth and engaging experience without compromising on security. The speed advantage of SecretVRF enhances the user experience with immediate feedback and results at the end of every lottery round.

EVM.bet is built with a vision to revolutionize on-chain gaming, offering a unique blend of security, transparency, and confidentiality that sets us apart in the market. Further plans will be made for additional games.

Website: [EVM.bet](https://EVM.bet)

MVP video: https://youtu.be/KGT1CNoT1_Y

### Kakarot Sepolia

Lottery contract: [0xCFB024DE4bD45700d53d91CDdF7836348DA3c8CC](https://sepolia-blockscout.kakarot.org/address/0xCFB024DE4bD45700d53d91CDdF7836348DA3c8CC)

RandomnessReceiver contract: [0xbAe61D17445AdD862C306A24d12F41906cc0FFa3](https://sepolia-blockscout.kakarot.org/address/0xbAe61D17445AdD862C306A24d12F41906cc0FFa3)

### Kakarot MainNet

Lottery contract: Coming Soon

RandomnessReceiver contract: Coming Soon

### Github Action Status Badge

[![EVM.bet Kakarot TestNet Scheduler](https://github.com/Smart-Earners-Team/Automations/actions/workflows/evm-bet-kakarot-testnet-scheduler.yml/badge.svg)](https://github.com/Smart-Earners-Team/Automations/actions/workflows/evm-bet-kakarot-testnet-scheduler.yml)

Used to automate the calls to **closeLottery**, **startLottery** & **drawFinalNumberAndMakeLotteryClaimable** on the lottery smart contract.
