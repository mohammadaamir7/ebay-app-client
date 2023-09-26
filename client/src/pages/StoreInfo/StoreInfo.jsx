import "./ListingEdit.css";

import React from "react";
import StoreEditOptions from "../../components/StoreEditOptions/StoreEditOptions";

const ListingEdit = () => {
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-8">
                    <StoreEditOptions/>
                </div>
            </div>
        </div>
    );
};

export default ListingEdit;
