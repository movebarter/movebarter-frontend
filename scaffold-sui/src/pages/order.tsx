import { GLOBAL_ORDER, DAPP_ADDRESS } from "../config/constants";
import { OrderForm, Order } from "../types/Order";
import { NFT } from "../types/NFT";
import { useEffect, useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { JsonRpcProvider } from "@mysten/sui.js";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai"; 
import { ReplaceChar } from "../utils/util";
import { isPromise } from "util/types";

export default function Home() {
    
    const provider = new JsonRpcProvider();
    const { account, connected, signAndExecuteTransaction } = useWallet();
    const [isOpenList, setIsOpenList] = useState<Boolean[]>([]);
    const [nftList, setNftList] = useState<Array<NFT>>([]);
    const [tx, setTx] = useState('');
    const [orderList, setOrderList] = useState<Array<Order>>([]);
    const [ orderFormInput, updateOrderFormInput ] = useState<OrderForm>({
        baseNFTID: undefined,
        targetNFTID: undefined,
        targetNFTVal: undefined,
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
        setTx('exchange')
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
        setTx('delete')
    }

    async function fetch_all_orders() {
        console.log('fetch all orders');
        const orderId = GLOBAL_ORDER;
        
        const orderListObject = await provider.getObject(orderId)
        
        const orderIdList = orderListObject.details.data.fields.oids
        const orderObjects = await provider.getObjectBatch(orderIdList)
        
        const orderList = orderObjects.filter(item => item.status === "Exists").map(item => {
            let id = item.details.data.fields.id.id;
            let baseNFTId = item.details.data.fields.base_token.fields.id.id;
            let targetNFTId = item.details.data.fields.target_token_id;
            let targetNFTPropertyValue = item.details.data.fields.target_property_value;

            let res: Order = {
                id: id,
                baseNFTId: baseNFTId,
                targetNFTId: targetNFTId,
                targetNFTPropertyValue: targetNFTPropertyValue == null ? "" : String.fromCharCode(...targetNFTPropertyValue),
            }
            return res
        });
        const isOpenList: Boolean[] = new Array(orderIdList.length);
        for (let i = 0; i < orderIdList.length; i++) {
            isOpenList[i] = false;
        }
        setIsOpenList(isOpenList);
        setOrderList(orderList);
        setTx('fetch');
    }

    // 获取账户下所有的nft
    async function fetch_all_nft() {
        console.log('fetch_all_nft')
        const objects = await provider.getObjectsOwnedByAddress(account!.address)
        const nftIds = objects.filter(item => item.type === DAPP_ADDRESS + "::exchange::Nft").map(item => item.objectId);
        const nftObjects = await provider.getObjectBatch(nftIds)
        const nftList = nftObjects.filter(item => item.status === "Exists").map(item => {
            let res: NFT = {
                id: item.details.data.fields.id.id,
                name: String.fromCharCode(...item.details.data.fields.name),
                desc: String.fromCharCode(...item.details.data.fields.description),
                property: String.fromCharCode(...item.details.data.fields.property_value),
              }
            return res
        })
        setNftList(nftList)
    }

    function take_order(order: Order) {
        console.log('order____: ', order);
        return {
            packageObjectId: DAPP_ADDRESS,
            module: 'exchange',
            function: 'take_order',
            typeArguments: [],
            arguments: [
                "0xff6a149024adb9b3dcf090555c31fb13d1813f0a",
                order.targetNFTId,
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
        console.log(targetNFTVal);
        let targetNFTValList: any = [];
        if (targetNFTVal != undefined) {
            targetNFTValList = [targetNFTVal];
        }
        let targetNFTIDList: any = [];
        if (targetNFTID != undefined) {
            targetNFTIDList = [targetNFTID];
        }
        let argument: any[] = [
            "0xff6a149024adb9b3dcf090555c31fb13d1813f0a", // order的地址
            baseNFTID,
            targetNFTIDList,
            targetNFTValList,
        ]
        console.log('argument', argument);
        return {
            packageObjectId: DAPP_ADDRESS,
            module: 'exchange',
            function: 'submit_order',
            typeArguments: [],
            arguments: argument,
            gasBudget: 30000,
        }
    }

    function updateOrderTargetNFTID(order: Order, id: string, idx: number) {
        setIsOpenList(isOpenList.map((item, idx1) => idx1 == idx ? !item : item))

        order.targetNFTId = id;
    }

    useEffect(() => {
        (async () => {
          if (connected) {
            fetch_all_orders()
            fetch_all_nft()
          }
        })()
    }, [connected, tx])

    return (
        <div>
            <div className="w-full">
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
                    placeholder="Target NFT Value"
                    className="mt-8 p-4 input input-bordered input-primary w-full"
                    onChange={(e) =>
                        updateOrderFormInput({ ...orderFormInput, targetNFTVal: e.target.value })
                    }
                />
                <br></br>
                <button
                    onClick={create_order}
                    className="btn btn-primary font-bold mt-4 text-white rounded-lg p-4 shadow-lg">
                    Create Order
                </button>
            </div>
            <br />
            <p className="mt-4 text-2xl"><b>Order List</b></p>
            <table className="w-full table-auto overflow-auto">
                <thead className="border-b">
                <tr>
                    <th scope="col" className="text-base font-medium text-gray-900 px-6 py-4 text-lef">ID</th>
                    <th scope="col" className="text-base font-medium text-gray-900 px-6 py-4 text-lef">Base NFT ID</th>
                    <th scope="col" className="text-base font-medium text-gray-900 px-6 py-4 text-lef">Target NFT ID</th>
                    <th scope="col" className="text-base font-medium text-gray-900 px-6 py-4 text-lef">Target NFT Value</th>
                    <th scope="col" className="text-base font-medium text-gray-900 px-6 py-4 text-lef"></th>
                    <th scope="col" className="text-base font-medium text-gray-900 px-6 py-4 text-lef"></th>
                    <th scope="col" className="text-base font-medium text-gray-900 px-6 py-4 text-lef"></th>
                </tr>
                </thead>
                <tbody>
                {
                    orderList.map((order, idx) => {
                        return (
                            <tr key={order.id} className="border-b">
                                <td className="text-sm font-medium text-gray-900 text-center">{ReplaceChar(order.id)}</td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">{ReplaceChar(order.baseNFTId)}</td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">{ReplaceChar(order.targetNFTId ? order.targetNFTId: "")}</td>
                                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">{order.targetNFTPropertyValue ? order.targetNFTPropertyValue : ""}</td>
                                <td className="pr-2 text-center">
                                    { order.targetNFTPropertyValue == "" ? <div></div> : <div>
                                    <button 
                                        className="bg-purple-500 flex text-white text-sm rounded-sm px-2 justify-between w-20"
                                        onClick={() => setIsOpenList(isOpenList.map((item, idx1) => idx1 == idx ? !item : item))}
                                    >
                                        Select
                                        {
                                            isOpenList[idx] ? (
                                                <AiOutlineCaretDown className="h-5"/>
                                            ): (
                                                <AiOutlineCaretUp className="h-5" />
                                            )
                                        }
                                    </button>
                                    {
                                        isOpenList[idx] && nftList.filter(item => item.property === order.targetNFTPropertyValue).length > 0 && <div className="border border-purple-400 absolute flex flex-col items-start rounded-md p-2 mt-0.5 bg-white">
                                            {nftList.filter(item => item.property === order.targetNFTPropertyValue).map((item) => (
                                                <div key={item.id} className="flex justify-between cursor-pointer hover:bg-purple-200">
                                                    <button className="text-sm text-purple-400" onClick={(e) => updateOrderTargetNFTID(order, item.id, idx)}>{ReplaceChar(item.id)}</button>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    </div>
                                    }
                                </td>
                                <td className="pr-2 text-center">
                                    <button 
                                        className="bg-blue-500 text-white text-sm rounded-xl px-4" 
                                        onClick={(e) => exchange(order)}
                                    >Exchange</button>
                                </td>
                                <td className="pl-2 text-center">
                                    <button 
                                        className="bg-red-500 text-white text-sm rounded-xl px-4"
                                        onClick={(e) => delete_order(order)}
                                    >Cancel</button>
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