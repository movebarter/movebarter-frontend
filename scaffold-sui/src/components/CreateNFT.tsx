import React from "react";
import { NFTForm } from "../types/NFT";

interface Props {
    updateFormInput: (form: NFTForm) => void;
    formInput?: NFTForm;
}

export function CreateNFT({ updateFormInput, formInput }: Props) {
    // async function mint_example_nft() {
    //     // setMessage("");
    //     try {
    //         const data = create_example_nft()
    //         const resData = await signAndExecuteTransaction({
    //         transaction: {
    //             kind: 'moveCall',
    //             data,
    //         },
    //         });
    //         console.log('success', resData);
    //         setMessage('Mint succeeded');
    //         setTx('https://explorer.sui.io/transaction/' + resData.certificate.transactionDigest)
    //     } catch (e) {
    //         console.error('failed', e);
    //         setMessage('Mint failed: ' + e);
    //         setTx('');
    //     }
    // }

    // function create_example_nft() {
    // const { name, url, description } = formInput;
    // return {
    //     packageObjectId: PACKAGE_ID,
    //     module: 'devnet_nft',
    //     function: 'mint',
    //     typeArguments: [],
    //     arguments: [
    //     name,
    //     description,
    //     url,
    //     ],
    //     gasBudget: 30000,
    // };
    // }
    return (
        <div>
            <input
                placeholder="NFT Name"
                className="mt-4 p-4 input input-bordered input-primary w-full"
                onChange={(e) =>
                updateFormInput({ ...formInput, name: e.target.value })
                }
            />
            <br></br>
            <input
                placeholder="NFT Description"
                className="mt-8 p-4 input input-bordered input-primary w-full"
                onChange={(e) =>
                updateFormInput({ ...formInput, description: e.target.value })
                }
            />
            <br></br>
            <input
                placeholder="Property Key"
                className="mt-8 p-4 input input-bordered input-primary w-full"
                onChange={(e) =>
                updateFormInput({ ...formInput, propertyKey: e.target.value })
                }
            />
            <input
                placeholder="Property Value"
                className="mt-8 p-4 input input-bordered input-primary w-full"
                onChange={(e) =>
                updateFormInput({ ...formInput, propertyVal: e.target.value })
                }
            />
            <br></br>
            <button
                // onClick={mint_example_nft}
                className={
                "btn btn-primary font-bold mt-4 text-white rounded p-4 shadow-lg"
                }>
                Mint example NFT
            </button>
        </div>
    );
}