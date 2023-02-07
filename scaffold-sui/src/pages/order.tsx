import { OrderForm } from "../types/Order"
import { Order } from "../components/OrderList"
import { useEffect, useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { OrderList } from "../components/OrderList";
import { JsonRpcProvider } from "@mysten/sui.js";
import { DAPP_ADDRESS } from "../config/constants";

export default function Home() {
    // let orderList: Order[] = [
    //     {
    //         id: "1",
    //         baseNFTId: "2",
    //         targetNFTId: "3",
    //         targetNFTPropertyKey: "key1",
    //         targetNFTPropertyValue: "val1"
    //     }
    // ]
    const provider = new JsonRpcProvider();
    const { account, connected, signAndExecuteTransaction } = useWallet();
    const PACKAGE_ID = DAPP_ADDRESS;
    const [tx, setTx] = useState('');
    const [orderList, setOrderList] = useState<Array<Order>>([]);
    const [ orderFormInput, updateOrderFormInput ] = useState<OrderForm>({
        baseNFTID: "",
        targetNFTID: "",
        targetNFTKey: "",
        targetNFTVal: ""
    });

    async function create_order() {
        console.log('create_order')
        await signAndExecuteTransaction(
            {
                transaction: {
                    kind: 'moveCall',
                    data: submit_order()
                }
            }
        )
    }

    async function exchange() {
        console.log('exchange')
        await signAndExecuteTransaction(
            {
                transaction: {
                    kind: 'moveCall',
                    data: exchange_nft(),
                }
            }
        )
    }

    async function delete_order() {
        console.log('delete order')
        await signAndExecuteTransaction(
            {
                transaction: {
                    kind: 'moveCall',
                    data: cancel_order(),
                }
            }
        )
    }

    async function fetch_all_orders() {
        console.log('fetch all orders');
        const orderListObjectId = '123';
        const orderObjects = await provider.getObject(orderListObjectId)
        const orderList = orderObjects.details.data.fields.orders.filter(item => item.status === "Exists").map(item => {
            let res: Order = {
                id: item.details.data.fields.id.id,
                baseNFTId: item.details.data.fields.base_token.id,
                targetNFTId: item.details.data.fields.target_token_id,
                targetNFTPropertyKey: item.details.data.fields.target_property_value,
                targetNFTPropertyValue: item.details.data.fields.targetNFTPropertyValue,
            }
            return res
        });
        setOrderList(orderList);
    }

    function exchange_nft() {
        return {
            packageObjectId: DAPP_ADDRESS,
            module: 'exchange',
            function: 'submit_order',
            typeArguments: [

            ],
            arguments: [

            ],
            // gasPayment: '',
            gasBudget: 30000,
        }
    }

    function cancel_order() {
        return {
            packageObjectId: DAPP_ADDRESS,
            module: 'exchange',
            function: 'cancel_order',
            typeArguments: [
                
            ],
            arguments: [

            ],
            // gasPayment: '',
            gasBudget: 30000,
        }
    }

    function submit_order() {
        return {
            packageObjectId: DAPP_ADDRESS,
            module: 'exchange',
            function: 'submit_order',
            typeArguments: [

            ],
            arguments: [

            ],
            gasBudget: 30000,
        }
    }

    useEffect(() => {
        (async () => {
          if (connected) {
            fetch_all_orders()
          }
        })()
    }, [connected, tx])

    return (
        <div>
            <div>
                <input
                    placeholder="Base NFT ID"
                    className="mt-4 p-4 input input-bordered input-primary w-full"
                    onChange={(e) =>
                        updateOrderFormInput({ ...orderFormInput, baseNFTID: e.target.value })
                    }
                />
                <br></br>
                <input
                    placeholder="Target NFT ID"
                    className="mt-8 p-4 input input-bordered input-primary w-full"
                    onChange={(e) =>
                        updateOrderFormInput({ ...orderFormInput, targetNFTID: e.target.value })
                    }
                />
                <br></br>
                <input
                    placeholder="Target NFT Key"
                    className="mt-8 p-4 input input-bordered input-primary w-full"
                    onChange={(e) =>
                        updateOrderFormInput({ ...orderFormInput, targetNFTKey: e.target.value })
                    }
                />
                <br></br>
                <input
                    placeholder="Target NFT Value"
                    className="mt-8 p-4 input input-bordered input-primary w-full"
                    onChange={(e) =>
                        updateOrderFormInput({ ...orderFormInput, targetNFTVal: e.target.value })
                    }
                />
                <br></br>
                <button
                    onClick={submit_order}
                    className="btn btn-primary font-bold mt-4 text-white rounded p-4 shadow-lg">
                    Create Order
                </button>
            </div>
            <p className="mt-4"><b>Order List:</b></p>
            <OrderList orderList={ orderList }/>
        </div>
    )
}