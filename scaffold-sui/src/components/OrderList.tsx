
export interface Order {
    id: string,
    baseNFTId: string,
    targetNFTId: string,
    targetNFTPropertyKey: string,
    targetNFTPropertyValue: string,
}

interface Props {
    orderList: Order[]
}

export function OrderList({ orderList }: Props) {
    return (
        <div >
            <table className="min-w-full table-auto">
                <thead className="border-b">
                    <tr>
                        <th scope="col" className="text-xl font-medium text-gray-900 px-6 py-4 text-lef">ID</th>
                        <th scope="col" className="text-xl font-medium text-gray-900 px-6 py-4 text-lef">Base NFT ID</th>
                        <th scope="col" className="text-xl font-medium text-gray-900 px-6 py-4 text-lef">Target NFT ID</th>
                        <th scope="col" className="text-xl font-medium text-gray-900 px-6 py-4 text-lef">Target NFT Key</th>
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
                                <td className="text-xl text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">{order.targetNFTPropertyKey}</td>
                                <td className="text-xl text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">{order.targetNFTPropertyValue}</td>
                                <td>
                                    <button>exchange nft id</button>
                                </td>
                                <td>
                                    <button>take order</button>
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