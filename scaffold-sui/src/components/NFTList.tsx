

export interface NFT {
    id: string,
    name: string,
    desc: string,
    property: string,
}

interface Props {
    nftList: NFT[],
}

export function NFTList({ nftList }: Props) {
    return (
        <div>
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