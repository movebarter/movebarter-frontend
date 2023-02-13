import Image from "next/image";
import { NavItem } from "./NavItem";
import { SuiConnect } from "./SuiConnect";
import {
  MODULE_URL
} from "../config/constants";

export function NavBar() {
  return (
    <nav className="navbar py-4 pr-2 bg-base-100">
      <div className="flex-1">
        <ul className="menu menu-horizontal p-0">
          <NavItem href="/" title="Movebarter" />
          <NavItem href="/nft" title="NFT" />
          <NavItem href="/order" title="Order" />
          <li className="font-sans font-semibold text-lg">
            <a href={MODULE_URL} target="_blank">Contract on Explorer</a>
          </li>
        </ul>
      </div>
      <SuiConnect />
      
    </nav>
  );
}
