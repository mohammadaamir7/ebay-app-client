import "./ListingEdit.css";

import RightPanel from "../../components/ItemEditOptions/RightPanel";
import React from "react";
import ListingEditOptions from "../../components/ListingEditOptions/ListingEditOptions";

const ListingEdit = () => {
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-8">
                    <ListingEditOptions/>
                </div>
            </div>
        </div>
    );
};

export default ListingEdit;
