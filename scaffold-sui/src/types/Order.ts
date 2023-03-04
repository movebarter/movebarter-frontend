export interface Order {
    id: string,
    baseNFTId: string,
    targetNFTId1?: string,
    targetNFTId2?: string,
    targetNFTPropertyValue?: string,
}

export interface OrderForm {
    baseNFTID?: string,
    targetNFTId1?: string,
    targetNFTId2?: string,
    targetNFTVal?: string,
}