import { useState } from "react";
import { SVG } from "../svg";
import { Drawer } from "./drawer";
import { DrawerItem } from "./drawer-item";
import { Dropdown } from "./dropdown";
import { DropdownItem } from "./dropdown-item";

export const SideNav = () => {
  const { dashboard, purchase, shoppingCart, order, collection, left, down } =
    SVG;
  const [catalogDrop, setCatalogDrop] = useState(false);
  const handleCatalogClick = () => {
    setCatalogDrop(!catalogDrop);
  };
  const [purchaseDrop, setPurchaseDrop] = useState(false);
  const handlePurchaseClick = () => {
    setPurchaseDrop(!purchaseDrop);
  };
  const [saleDrop, setSaleDrop] = useState(false);
  const handleSaleClick = () => {
    setSaleDrop(!saleDrop);
  };
  const [orderDrop, setOrderDrop] = useState(false);
  const handleOrderClick = () => {
    setOrderDrop(!orderDrop);
  };
  return (
    <Drawer>
      <DrawerItem type="link" href="/" isActive={true}>
        <div className="px-2">{dashboard}</div> Dashboard
      </DrawerItem>
      <DrawerItem type="button" handleClick={handleCatalogClick}>
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row">
            <div className="px-2">{collection}</div>Catalog
          </div>
          {catalogDrop ? <div>{down}</div> : <div>{left}</div>}
        </div>
      </DrawerItem>
      {catalogDrop && (
        <Dropdown>
          <DropdownItem type="button" href="/products">Products</DropdownItem>
          <DropdownItem type="button">Facets</DropdownItem>
          <DropdownItem type="button">Collections</DropdownItem>
          <DropdownItem type="button">Assets</DropdownItem>
        </Dropdown>
      )}
      <DrawerItem type="button" handleClick={handlePurchaseClick}>
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row">
            <div className="px-2">{purchase}</div>Purchase
          </div>
          {purchaseDrop ? <div>{down}</div> : <div>{left}</div>}
        </div>
      </DrawerItem>
      {purchaseDrop && (
        <Dropdown>
          <DropdownItem type="button">Purchase List</DropdownItem>
          <DropdownItem type="button">Add Purchase</DropdownItem>
          <DropdownItem type="button">Import Purchase By CSV</DropdownItem>
        </Dropdown>
      )}
      <DrawerItem type="button" handleClick={handleSaleClick}>
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row">
            <div className="px-2">{shoppingCart}</div>Sale
          </div>
          {saleDrop ? <div>{down}</div> : <div>{left}</div>}
        </div>
      </DrawerItem>
      {saleDrop && (
        <Dropdown>
          <DropdownItem type="button">Sale List</DropdownItem>
          <DropdownItem type="button">Add Sale</DropdownItem>
          <DropdownItem type="button">Import Sale By CSV</DropdownItem>
        </Dropdown>
      )}
      <DrawerItem type="button" handleClick={handleOrderClick}>
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row">
            <div className="px-2">{order}</div>Order
          </div>
          {orderDrop ? <div>{down}</div> : <div>{left}</div>}
        </div>
      </DrawerItem>
      {orderDrop && (
        <Dropdown>
          <DropdownItem type="button">Order List</DropdownItem>
          <DropdownItem type="button">Add Order</DropdownItem>
          <DropdownItem type="button">Import Order By CSV</DropdownItem>
        </Dropdown>
      )}
    </Drawer>
  );
};
