import {
  DAPP_ADDRESS,
} from "../config/constants";
import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react";
import React from "react";
import Link from 'next/link';
import { CreateNFT } from "../components/CreateNFT";
import { JsonRpcProvider } from '@mysten/sui.js';

export default function Home() {
  const provider = new JsonRpcProvider();
  const { account, connected, signAndExecuteTransaction } = useWallet();
  
  const [tx, setTx] = useState('');
  const [nfts, setNfts] = useState<Array<{ id: string, name: string, url: string, description: string }>>([]);

  const PACKAGE_ID = remove_leading_zero(DAPP_ADDRESS);

  function remove_leading_zero(address: string) {
    return address.replace(/0x[0]+/, '0x')
  }

  async function fetch_example_nft() {
    const objects = await provider.getObjectsOwnedByAddress(account!.address)
    const nft_ids = objects
      .filter(item => item.type === PACKAGE_ID + "::devnet_nft::DevNetNFT")
      .map(item => item.objectId)
    const nftObjects = await provider.getObjectBatch(nft_ids)
    const nfts = nftObjects.filter(item => item.status === "Exists").map(item => {
      return {
        id: item.details.data.fields.id.id,
        name: item.details.data.fields.name,
        url: item.details.data.fields.url,
        description: item.details.data.fields.description,
      }
    })
    setNfts(nfts)
  }

  useEffect(() => {
    (async () => {
      if (connected) {
        fetch_example_nft()
      }
    })()
  }, [connected, tx])

  return (
    <div>
      <p><b>Welcome to MoveBarter</b></p>
      <p className="mt-4"><b>Module Path:</b> {PACKAGE_ID}::movebarter</p>
      <br></br>
    </div>
  );
}
