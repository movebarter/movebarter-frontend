import { OrderForm } from "../types/Order"

interface Props {
    updateFormInput: (order: OrderForm) => void,
    formInput: OrderForm,
}

export function CreateOrder({updateFormInput, formInput}: Props) {
    return(
        <div>
            <input
                placeholder="Base NFT ID"
                className="mt-4 p-4 input input-bordered input-primary w-full"
                onChange={(e) =>
                updateFormInput({ ...formInput, baseNFTID: e.target.value })
                }
            />
            <br></br>
            <input
                placeholder="Target NFT ID"
                className="mt-8 p-4 input input-bordered input-primary w-full"
                onChange={(e) =>
                updateFormInput({ ...formInput, targetNFTID: e.target.value })
                }
            />
            <br></br>
            <input
                placeholder="Target NFT Key"
                className="mt-8 p-4 input input-bordered input-primary w-full"
                onChange={(e) =>
                updateFormInput({ ...formInput, targetNFTKey: e.target.value })
                }
            />
            <br></br>
            <input
                placeholder="Target NFT Value"
                className="mt-8 p-4 input input-bordered input-primary w-full"
                onChange={(e) =>
                updateFormInput({ ...formInput, targetNFTVal: e.target.value })
                }
            />
            <br></br>
            <button
                // onClick={mint_example_nft}
                className="btn btn-primary font-bold mt-4 text-white rounded p-4 shadow-lg">
                Create Order
            </button>
        </div>
    )
}