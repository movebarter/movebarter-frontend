export interface Order {
    id: string,
    baseNFTId: string,
    targetNFTId?: string,
    targetNFTPropertyValue?: string,
}

export interface OrderForm {
    baseNFTID?: string,
    targetNFTID?: string,
    targetNFTVal?: string,
}