import { OrderForm } from "../types/Order"
import { Order } from "../components/OrderList"
import { useState } from "react";
import { CreateOrder } from "../components/CreateOrder";
import { OrderList } from "../components/OrderList";

export default function Home() {
    let orderList: Order[] = [
        {
            id: "1",
            baseNFTId: "2",
            targetNFTId: "3",
            targetNFTPropertyKey: "key1",
            targetNFTPropertyValue: "val1"
        }
    ]
    const [ orderFormInput, updateOrderFormInput ] = useState<OrderForm>({
        baseNFTID: "",
        targetNFTID: "",
        targetNFTKey: "",
        targetNFTVal: ""
    });
    return (
        <div>
            <CreateOrder updateFormInput={updateOrderFormInput} formInput={ orderFormInput } />
            <p className="mt-4"><b>Order List:</b></p>
            <OrderList orderList={ orderList }/>
        </div>
    )
}