import {
  DAPP_ADDRESS,
} from "../config/constants";
import React from "react";

export default function Home() {
  const PACKAGE_ID = remove_leading_zero(DAPP_ADDRESS);

  function remove_leading_zero(address: string) {
    return address.replace(/0x[0]+/, '0x')
  }

  return (
    <div>
      <p><b>Welcome to Movebarter</b></p>
      <p className="mt-4"><b>Module Path:</b> {PACKAGE_ID}::movebarter</p>
      <br></br>
    </div>
  );
}
