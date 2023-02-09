export const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY!;
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export const DAPP_NAME = process.env.NEXT_PUBLIC_DAPP_NAME!; // changed here.
export const DAPP_ADDRESS = process.env.NEXT_PUBLIC_DAPP_ADDRESS!; // changed here.
export const MARKET_COINT_TYPE = process.env.NEXT_PUBLIC_MARKET_COIN_TYPE!;
export const GLOBAL_ORDER = "0xff6a149024adb9b3dcf090555c31fb13d1813f0a";
export const NETWORK=process.env.NEXT_PUBLIC_SUI_NETWORK!;

export const MODULE_URL="https://explorer.sui.io/object/" + DAPP_ADDRESS + "?network=" + NETWORK
