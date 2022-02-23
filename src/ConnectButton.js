import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks,
} from "@airgap/beacon-sdk";
import { useEffect } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
const ConnectButton = (props) => {
  const {
    Tezos,
    setContract,
    setPublicToken,
    setWallet,
    setUserAddress,
    setUserBalance,
    setStorage,
    contractAddress,
    setBeaconConnection,
    wallet,
  } = props;

  const setup = async (userAddress) => {
    setUserAddress(userAddress);
    // updates balance
    const balance = await Tezos.tz.getBalance(userAddress);
    setUserBalance(balance.toNumber());
    // creates contract instance
    const contract = await Tezos.wallet.at(contractAddress);
    const storage = await contract.storage();
    setContract(contract);
    setStorage(storage.toNumber());
  };

  const connectWallet = async () => {
    try {
      await wallet.requestPermissions({
        network: {
          type: NetworkType.MAINNET,
          rpcUrl: "https://mainnet.api.tez.ie",
        },
      });
      // gets user's address
      const userAddress = await wallet.getPKH();
      await setup(userAddress);
      setBeaconConnection(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      // creates a wallet instance
      const wallet = new BeaconWallet({
        name: "Taquito Boilerplate",
        preferredNetwork: NetworkType.MAINNET,
        disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
        eventHandlers: {
          // To keep the pairing alert, we have to add the following default event handlers back
          [BeaconEvent.PAIR_INIT]: {
            handler: defaultEventCallbacks.PAIR_INIT,
          },
          [BeaconEvent.PAIR_SUCCESS]: {
            handler: (data) => setPublicToken(data.publicKey),
          },
        },
      });
      Tezos.setWalletProvider(wallet);
      setWallet(wallet);
      // checks if wallet was connected before
      const activeAccount = await wallet.client.getActiveAccount();
      if (activeAccount) {
        const userAddress = await wallet.getPKH();
        await setup(userAddress);
        setBeaconConnection(true);
      }
    })();
  }, []);
  return (
    <div>
      <button onClick={connectWallet}>Connect</button>
    </div>
  );
};

export default ConnectButton;
