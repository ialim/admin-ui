import { useState } from "react";
import { SVG } from "../public/svg";
import { DrawerItem } from "./drawer-item";

type ActionType = "VIEW" | "EDIT" | "ADD PAYMENT" | "VIEW PAYMENT" | "DELETE";

interface ActionProps {
  actions: ActionType[];
  id: string;
  dataType?: string;
}

export const Action = ({ actions, id, dataType }: ActionProps) => {
  const [drop, setdrop] = useState(false);
  const { up, down, eye, pencil, plus, cash, trash } = SVG;
  return (
    <div className=" text-sm">
      <button
        onClick={() => setdrop(!drop)}
        className="flex flex-row justify-between border-[1px] border-gray-500 px-3 py-2"
      >
        <span className="font-normal mr-1">Action</span>
        {drop ? <div>{up}</div> : <div>{down}</div>}
      </button>
      <div className="absolute mt-1 border-gray-500 border-[1px]">
        {drop && (
          <ul className="bg-gray-100">
            {actions?.map((action, index) => (
              <>
                {action === "VIEW" ? (
                  <DrawerItem key={action} type="button">
                    <span className="mr-4 w-5">{eye}</span> View
                  </DrawerItem>
                ) : (
                  ""
                )}

                {action === "EDIT" ? (
                  <DrawerItem
                    key={action}
                    type="link"
                    href={`/update-${dataType}`}
                    query={id}
                  >
                    <span className="mr-4 w-5">{pencil}</span>Edit
                  </DrawerItem>
                ) : (
                  ""
                )}
                {action === "ADD PAYMENT" ? (
                  <DrawerItem key={action} type="button">
                    <span>{plus}</span>Add Payment
                  </DrawerItem>
                ) : (
                  ""
                )}
                {action === "VIEW PAYMENT" ? (
                  <DrawerItem key={action} type="button">
                    <span>{cash}</span>View Payment
                  </DrawerItem>
                ) : (
                  ""
                )}

                {action === "DELETE" ? (
                  <DrawerItem key={action} type="link">
                    <span>{trash}</span>Delete
                  </DrawerItem>
                ) : (
                  ""
                )}
              </>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
