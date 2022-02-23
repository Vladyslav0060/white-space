import { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import ConnectButton from "./ConnectButton";
import logo from "./logo.svg";
import "./App.css";
import TestConnect from "./TestConnect";

function App() {
  const [Tezos, setTezos] = useState(
    new TezosToolkit("https://mainnet.api.tez.ie")
  );
  const [contract, setContract] = useState(undefined);
  const [publicToken, setPublicToken] = useState("");
  const [wallet, setWallet] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [storage, setStorage] = useState(0);
  const [copiedPublicToken, setCopiedPublicToken] = useState(false);
  const [beaconConnection, setBeaconConnection] = useState(false);
  const [activeTab, setActiveTab] = useState("transfer");
  const contractAddress = "KT1N11kC9LuDnhAWV4r7fr3dFfDUB3HXwkix";

  // Tezos.tz
  //   .getBalance("tz2RUdWk1x58WwGbMhGBiuqHhJoX7MEKu7Rz")
  //   .then((balance) => console.log(`${balance.toNumber() / 1000000} ꜩ`))
  //   .catch((error) => console.log(JSON.stringify(error)));

  return (
    <div className="App">
      {/* <ConnectButton
        Tezos={Tezos}
        setContract={setContract}
        setPublicToken={setPublicToken}
        setWallet={setWallet}
        setUserAddress={setUserAddress}
        setUserBalance={setUserBalance}
        setStorage={setStorage}
        contractAddress={contractAddress}
        setBeaconConnection={setBeaconConnection}
        wallet={wallet}
      /> */}
      <TestConnect />
    </div>
  );
}

export default App;
