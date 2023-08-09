import "./ItemEdit.css";

import ItemEditOptions from '../../components/ItemEditOptions/ItemEditOptions';
import RightPanel from "../../components/ItemEditOptions/RightPanel";
import React from "react";
import InventoryPanel from "../../components/ItemEditOptions/InventoryPanel";

const ItemEdit = () => {
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-8">
                    <ItemEditOptions/>
                    <InventoryPanel/>
                </div>
                <div className="col-md-4">
                    <RightPanel/>
                </div>
            </div>
        </div>
    );
};

export default ItemEdit;
