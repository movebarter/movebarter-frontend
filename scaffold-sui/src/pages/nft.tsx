import { DAPP_ADDRESS } from "../config/constants";
import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react";
import { NFTList, NFT } from "../components/NFTList";
import { JsonRpcProvider } from '@mysten/sui.js';

export default function Home() {
    const provider = new JsonRpcProvider();
    const { account, connected, signAndExecuteTransaction } = useWallet();
    // const PACKAGE_ID = remove_leading_zero(DAPP_ADDRESS);
    const PACKAGE_ID = DAPP_ADDRESS;
    const [tx, setTx] = useState('');
    const [nftList, setNftList] = useState<Array<NFT>>([]);
    const [nFTFormInput, updateNFTFormInput] = useState<{
        name: string,
        description: string,
        propertyKey: string,
        propertyVal: string,
    }>({
        name: "",
        description: "",
        propertyKey: "",
        propertyVal: "",
    });
    // function remove_leading_zero(address: string) {
    //     return address.replace(/0x[0]+/, '0x')
    // }
    // 调用合约mint nft
    async function mint_nft() {
        console.log("mint nft____");
        try {
            const nft = build_nft()
            const data = await signAndExecuteTransaction({
                transaction: {
                    kind: 'moveCall',
                    data: nft,
                },
            });
            console.log('mint success', data);
            setTx('https://explorer.sui.io/transaction/' + data.certificate.transactionDigest)
        } catch(e) {
            console.error("mint failed.", e)
            setTx('');
        }
    }

    // 获取账户下所有的nft
    async function fetch_all_nft() {
        console.log('fetch all nft')
        const objects = await provider.getObjectsOwnedByAddress(account!.address)
        const nftIds = objects.filter(item => item.type === PACKAGE_ID + "::devnet_nft::DevNetNFT").map(item => item.objectId);
        const nftObjects = await provider.getObjectBatch(nftIds)
        const nftList = nftObjects.filter(item => item.status === "Exists").map(item => {
            let res: NFT = {
                id: item.details.data.fields.id.id,
                name: item.details.data.fields.name,
                desc: item.details.data.fields.desc,
                property: item.details.data.fields.property,
              }
            return res
        })
        setNftList(nftList)
    }

    // 根据表单信息构造钱包所需的结构体
    function build_nft() {
        const { name, description, propertyKey, propertyVal } = nFTFormInput
        const property = {
            propertyKey: propertyKey,
            propertyVal: propertyVal,
        }
        return {
            packageObjectId: PACKAGE_ID,
            module: 'exchange',
            function: 'mint',
            typeArguments: [],
            arguments: [
              name,
              description,
              JSON.stringify(property),
            ],
            gasBudget: 30000,
        };
    }

    useEffect(() => {
        (async () => {
          if (connected) {
            fetch_all_nft()
          }
        })()
    }, [connected, tx])

    // 测试用
    // let nftList: NFT[] = [
    //     {
    //         id: "1",
    //         name: "a",
    //         desc: "b",
    //         property: "{key1: val1}"
    //     }
    // ]

    
    return (
        <div>
            <div>
                <input
                    placeholder="NFT Name"
                    className="mt-4 p-4 input input-bordered input-primary w-full"
                    onChange={(e) =>
                        updateNFTFormInput({ ...nFTFormInput, name: e.target.value })
                    }
                />
                <br></br>
                <input
                    placeholder="NFT Description"
                    className="mt-8 p-4 input input-bordered input-primary w-full"
                    onChange={(e) =>
                        updateNFTFormInput({ ...nFTFormInput, description: e.target.value })
                    }
                />
                <br></br>
                <input
                    placeholder="Property Key"
                    className="mt-8 p-4 input input-bordered input-primary w-full"
                    onChange={(e) =>
                        updateNFTFormInput({ ...nFTFormInput, propertyKey: e.target.value })
                    }
                />
                <input
                    placeholder="Property Value"
                    className="mt-8 p-4 input input-bordered input-primary w-full"
                    onChange={(e) =>
                        updateNFTFormInput({ ...nFTFormInput, propertyVal: e.target.value })
                    }
                />
                <br></br>
                <button
                    onClick={mint_nft}
                    className={
                    "btn btn-primary font-bold mt-4 text-white rounded p-4 shadow-lg"
                    }>
                    Mint NFT
                </button>
            </div>
            <p className="mt-4"><b>Minted NFTs:</b></p>
            <NFTList nftList={ nftList }/>
        </div>
    )
}