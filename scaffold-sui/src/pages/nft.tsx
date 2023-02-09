import { DAPP_ADDRESS } from "../config/constants";
import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react";
import { JsonRpcProvider } from '@mysten/sui.js';
import { NFT } from "../types/NFT";

export default function Home() {
    const provider = new JsonRpcProvider();
    const { account, connected, signAndExecuteTransaction } = useWallet();    

    const [tx, setTx] = useState('');
    const [nftList, setNftList] = useState<Array<NFT>>([]);
    const [nFTFormInput, updateNFTFormInput] = useState<{
        name: string,
        description: string,
        propertyVal: string,
    }>({
        name: "",
        description: "",
        propertyVal: "",
    });
    // function remove_leading_zero(address: string) {
    //     return address.replace(/0x[0]+/, '0x')
    // }

    // 调用合约mint nft
    async function mint_nft() {
        console.log("mint nft____");
        try {
            const data = await signAndExecuteTransaction({
                transaction: {
                    kind: 'moveCall',
                    data: build_nft(),
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
        console.log("objects", objects)
        const nftIds = objects.filter(item => item.type === DAPP_ADDRESS + "::exchange::Nft").map(item => item.objectId);
        console.log('nftIds', nftIds)
        const nftObjects = await provider.getObjectBatch(nftIds)
        console.log('nftIds', nftIds)
        const nftList = nftObjects.filter(item => item.status === "Exists").map(item => {
            let res: NFT = {
                id: item.details.data.fields.id.id,
                name: String.fromCharCode(...item.details.data.fields.name),
                desc: String.fromCharCode(...item.details.data.fields.description),
                property: String.fromCharCode(...item.details.data.fields.property_value),
              }
            return res
        })
        console.log('nftList', nftList)
        setNftList(nftList)
    }

    // 根据表单信息构造钱包所需的结构体
    function build_nft() {
        const { name, description, propertyVal } = nFTFormInput
        
        return {
            packageObjectId: DAPP_ADDRESS,
            module: 'exchange',
            function: 'mint',
            typeArguments: [],
            arguments: [
                name,
                description,
                propertyVal,

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
            <table className="min-w-full table-auto">
                <thead className="border-b">
                <tr>
                    <th scope="col" className="text-xl font-medium text-gray-900 px-6 py-4 text-lef">ID</th>
                    <th scope="col" className="text-xl font-medium text-gray-900 px-6 py-4 text-lef">Name</th>
                    <th scope="col" className="text-xl font-medium text-gray-900 px-6 py-4 text-lef">Description</th>
                    <th scope="col" className="text-xl font-medium text-gray-900 px-6 py-4 text-lef">Properties</th>
                </tr>
                </thead>
                <tbody>
                {
                    nftList.map(nft => {
                        return (
                            <tr key={nft.id} className="border-b">
                                <td className="text-xl font-medium text-gray-900 text-center">{nft.id}</td>
                                <td className="text-xl text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">{nft.name}</td>
                                <td className="text-xl text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">{nft.desc}</td>
                                <td className="text-xl text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">{nft.property}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    )
}