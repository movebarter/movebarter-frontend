import { useState } from "react";
import { CreateNFT } from "../components/CreateNFT"
import { NFTList, NFT } from "../components/NFTList"

export default function Home() {
    let nftList: NFT[] = [
        {
            id: "1",
            name: "a",
            desc: "b",
            property: "{key1: val1}"
        }
    ]
    const [formInput, updateFormInput] = useState<{
        name: string;
        url: string;
        description: string;
      }>({
        name: "",
        url: "",
        description: "",
      });
    return (
        <div>
            <CreateNFT updateFormInput={updateFormInput} formInput={ formInput }/>
            <p className="mt-4"><b>Minted NFTs:</b></p>
            <NFTList nftList={ nftList }/>
        </div>
    )
}