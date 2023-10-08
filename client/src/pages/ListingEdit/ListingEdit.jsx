import "./ListingEdit.css";

import RightPanel from "../../components/ItemEditOptions/RightPanel";
import React from "react";
import ListingEditOptions from "../../components/ListingEditOptions/ListingEditOptions";

const ListingEdit = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <ListingEditOptions/>
                </div>
            </div>
        </div>
    );
};

export default ListingEdit;
