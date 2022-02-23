import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Tzip12Module, tzip12 } from "@taquito/tzip12";
import { useEffect, useState } from "react";
import { NetworkType } from "@airgap/beacon-sdk";
const Tezos = new TezosToolkit("https://mainnet.api.tez.ie");
Tezos.addExtension(new Tzip12Module());

const TestConnect = () => {
  const [contract, setContract] = useState(undefined);
  const [wallet, setWallet] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [userBalance, setUserBalance] = useState();
  const [isSync, setIsSync] = useState(false);
  const contractAddress = "KT1N11kC9LuDnhAWV4r7fr3dFfDUB3HXwkix";

  const setup = async (userAddress) => {
    setUserAddress(userAddress);
    const balance = await Tezos.tz.getBalance(userAddress);
    setUserBalance(balance.toNumber());
    const contract = await Tezos.wallet.at(contractAddress);
    const storage = await contract.storage();
    console.log("storage", storage);
    setContract(contract);
    setIsSync(true);
  };
  const disconnectWallet = async () => {
    if (wallet) {
      console.log("disconnecting wallet", wallet);
      setIsSync(false);
      setUserBalance(0);
      await wallet.client.removeAllAccounts();
      await wallet.client.removeAllPeers();
      await wallet.client.destroy();
    }
  };
  const connectWallet = async () => {
    try {
      await wallet.requestPermissions({
        network: {
          type: NetworkType.MAINNET,
          rpcUrl: "https://mainnet.api.tez.ie",
        },
      });
      const userAddress = await wallet.getPKH();
      Tezos.setWalletProvider(wallet);
      await setup(userAddress);
    } catch (error) {
      console.log(error);
    }
  };
  const setIsSyncActive = (activeAccount) => {
    activeAccount?.accountIdentifier ? setIsSync(true) : setIsSync(false);
  };
  useEffect(() => {
    console.log(wallet, "asdasdas");
  }, [wallet]);
  useEffect(() => {
    (async () => {
      const options = {
        name: "MyAwesomeDapp",
        iconUrl: "https://tezostaquito.io/img/favicon.png",
        preferredNetwork: "mainnet",
        eventHandlers: {
          PERMISSION_REQUEST_SUCCESS: {
            handler: async (data) => {
              console.log("permission data:", data);
              setIsSync(true);
            },
          },
        },
      };
      const newWallet = new BeaconWallet(options);
      Tezos.setWalletProvider(newWallet);
      const contract = await Tezos.contract.at(
        "KT1N11kC9LuDnhAWV4r7fr3dFfDUB3HXwkix",
        tzip12
      );
      console.log("CONT", contract);
      console.log("TTT", await contract.tzip12().getTokenMetadata(2));
      const activeAccount = await newWallet.client.getActiveAccount();
      if (activeAccount) {
        setUserAddress(activeAccount.address);
        const balance = Tezos.tz
          .getBalance(activeAccount.address)
          .then((balance) => setUserBalance(balance.toNumber() / 1000000))
          .catch((error) => console.log(JSON.stringify(error)));
      }
      setIsSyncActive(activeAccount);
      console.log("ACTIVE", activeAccount);
      setWallet(newWallet);
    })();
  }, []);
  return (
    <div>
      <button onClick={!isSync ? connectWallet : disconnectWallet}>
        {!isSync ? "Sync" : "Unsync"}
      </button>
      <p>{isSync ? userAddress : "need to login"}</p>
      {isSync ? (
        // <p>{userBalance > 0 ? "Has Token" : "Does not have Token"}</p>
        <p>User balance {userBalance}</p>
      ) : (
        ""
      )}
    </div>
  );
};

export default TestConnect;
