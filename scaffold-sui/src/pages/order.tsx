import { GLOBAL_ORDER, DAPP_ADDRESS } from "../config/constants";
import { OrderForm, Order } from "../types/Order"
import { useEffect, useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { JsonRpcProvider } from "@mysten/sui.js";


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
    console.log("golbal_order", GLOBAL_ORDER);
    const provider = new JsonRpcProvider();
    const { account, connected, signAndExecuteTransaction } = useWallet();
    const [tx, setTx] = useState('');
    const [orderList, setOrderList] = useState<Array<Order>>([]);
    const [ orderFormInput, updateOrderFormInput ] = useState<OrderForm>({
        baseNFTID: "",
        targetNFTID: "",
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
        setTx("true")
    }

    async function exchange(order: Order) {
        console.log('exchange')
        await signAndExecuteTransaction(
            {
                transaction: {
                    kind: 'moveCall',
                    data: take_order(order),
                }
            }
        )
    }

    async function delete_order(order: Order) {
        console.log('delete order')
        await signAndExecuteTransaction(
            {
                transaction: {
                    kind: 'moveCall',
                    data: cancel_order(order),
                }
            }
        )
    }

    async function fetch_all_orders() {
        console.log('fetch all orders');
        console.log('dapp', DAPP_ADDRESS);
        console.log("order", GLOBAL_ORDER);
        const orderId = GLOBAL_ORDER;
        
        const orderListObject = await provider.getObject(orderId)
        
        const orderIdList = orderListObject.details.data.fields.oids
        const orderObjects = await provider.getObjectBatch(orderIdList)
        
        const orderList = orderObjects.filter(item => item.status === "Exists").map(item => {
            let res: Order = {
                id: item.details.data.fields.id.id,
                baseNFTId: item.details.data.fields.base_token.fields.id.id,
                targetNFTId: item.details.data.fields.target_token_id,
                targetNFTPropertyValue: String.fromCharCode(...item.details.data.fields.target_property_value),
            }
            return res
        });
        
        setOrderList(orderList);
    }

    function take_order(order: Order) {
        return {
            packageObjectId: DAPP_ADDRESS,
            module: 'exchange',
            function: 'take_order',
            typeArguments: [],
            arguments: [
                "0xff6a149024adb9b3dcf090555c31fb13d1813f0a",
                order.baseNFTId,
                order.id,
            ],
            gasBudget: 30000,
        }
    }

    function cancel_order(order: Order) {
        return {
            packageObjectId: DAPP_ADDRESS,
            module: 'exchange',
            function: 'cancel_order',
            typeArguments: [],
            arguments: [
                "0xff6a149024adb9b3dcf090555c31fb13d1813f0a",
                order.id
            ],
            gasBudget: 30000,
        }
    }

    function submit_order() {
        const {baseNFTID, targetNFTID, targetNFTVal} = orderFormInput
        return {
            packageObjectId: DAPP_ADDRESS,
            module: 'exchange',
            function: 'submit_order',
            typeArguments: [],
            arguments: [
                "0xff6a149024adb9b3dcf090555c31fb13d1813f0a", // order的地址
                baseNFTID,
                [targetNFTID],
                [targetNFTVal],
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
    }, [connected, tx, orderList])

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
                    onClick={create_order}
                    className="btn btn-primary font-bold mt-4 text-white rounded p-4 shadow-lg">
                    Create Order
                </button>
            </div>
            <p className="mt-4"><b>Order List:</b></p>
            <table className="min-w-full table-auto">
                <thead className="border-b">
                <tr>
                    <th scope="col" className="text-xl font-medium text-gray-900 px-6 py-4 text-lef">ID</th>
                    <th scope="col" className="text-xl font-medium text-gray-900 px-6 py-4 text-lef">Base NFT ID</th>
                    <th scope="col" className="text-xl font-medium text-gray-900 px-6 py-4 text-lef">Target NFT ID</th>
                    <th scope="col" className="text-xl font-medium text-gray-900 px-6 py-4 text-lef">Target NFT Value</th>
                </tr>
                </thead>
                <tbody>
                {
                    orderList.map(order => {
                        return (
                            <tr key={order.id} className="border-b">
                                <td className="text-xl font-medium text-gray-900 text-center">{order.id}</td>
                                <td className="text-xl text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">{order.baseNFTId}</td>
                                <td className="text-xl text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">{order.targetNFTId}</td>
                                <td className="text-xl text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">{order.targetNFTPropertyValue}</td>
                                <td>
                                    <button onClick={(e) => exchange(order)}>exchange nft id</button>
                                </td>
                                <td>
                                    <button onClick={(e) => delete_order(order)}>cancel order</button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    )
}