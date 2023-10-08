import "./ItemEdit.css";

import ItemEditOptions from "../../components/ItemEditOptions/ItemEditOptions";
import RightPanel from "../../components/ItemEditOptions/RightPanel";
import React from "react";
import InventoryPanel from "../../components/ItemEditOptions/InventoryPanel";

const ItemEdit = () => {
  return (
    <div className="container">
      <h3 className="mb-5">Edit Item</h3>
      <div className="row">
        <div className="col-md-4">
          <h4>Details</h4>
          <p className="description-para">Title, Description and brand.</p>
        </div>
        <div className="col-md-8">
          <ItemEditOptions />
        </div>
        <div className="col-md-4">
          <h4>Inventory</h4>
          <p className="description-para">Inventory of item available per warehouse.</p>
        </div>
        <div className="col-md-8">
          <InventoryPanel />
        </div>
        <div className="col-md-4">
          <h4>Price and Quantity</h4>
          <p className="description-para">price and quantity of item.</p>
        </div>
        <div className="col-md-8">
          <RightPanel />
        </div>
      </div>
    </div>
  );
};

export default ItemEdit;
