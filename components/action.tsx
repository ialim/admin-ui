import { useState } from "react";
import { SVG } from "../public/svg";
import { DrawerItem } from "./drawer-item";
import { Dropdown } from "./dropdown";

type ActionType = "VIEW" | "EDIT" | "ADD PAYMENT" | "VIEW PAYMENT" | "DELETE";

interface ActionProps {
  actions: ActionType[];
  id: string;
}

export const Action = ({ actions = ["VIEW", "EDIT"], id }: ActionProps) => {
  const [drop, setdrop] = useState(false);
  const { up, down, eye, pencil, plus, cash, trash } = SVG;
  return (
    <div>
      <button
        onClick={() => setdrop(!drop)}
        className="flex flex-row justify-between"
      >
        <span>Action</span>
        {drop ? <div>{up}</div> : <div>{down}</div>}
      </button>
      {drop && (
        <Dropdown>
          {actions &&
            actions.map((action) => {
              action === "VIEW" ? (
                <DrawerItem type="button">
                  <span>{eye}</span> View
                </DrawerItem>
              ) : (
                ""
              );
              action === "EDIT" ? (
                <DrawerItem type="link">
                  <span>{pencil}</span>Edit
                </DrawerItem>
              ) : (
                ""
              );
              action === "ADD PAYMENT" ? (
                <DrawerItem type="button">
                  <span>{plus}</span>Add Payment
                </DrawerItem>
              ) : (
                ""
              );
              action === "VIEW PAYMENT" ? (
                <DrawerItem type="button">
                  <span>{cash}</span>View Payment
                </DrawerItem>
              ) : (
                ""
              );
              action === "DELETE" ? (
                <DrawerItem type="link">
                  <span>{trash}</span>Delete
                </DrawerItem>
              ) : (
                ""
              );
            })}
        </Dropdown>
      )}
    </div>
  );
};
