import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from 'react-redux';

import "./ItemEditOptions.css";
import {Link, useParams} from "react-router-dom";
import {getItemDetail, updateField} from "../../features/panelItemSlice";

const ItemEditOptions = () => {

    const {id} = useParams()
    const dispatch = useDispatch()

    const {status, data, error} = useSelector(state => state.panelItem)

    useEffect(() => {
        if (status === null || status === 'succeeded') {
            dispatch(getItemDetail({id}))
        }
    }, [])

    useEffect(() => {
        console.log("updated", status, data, error)
    }, [status, data, error])

    if (!status)
        return <h3>Item not found!</h3>

    else if (status === 'loading')
        return <h3>Loading...</h3>

    else if (status === 'failed')
        return <h3>Response error...</h3>

    const changeInput = (e, key) => {
        e.preventDefault()
        dispatch(updateField({key, val: e.target.value}))
    }

    return (
        <div className="card shadow">
            <div className="card-body">
                <div className="row">
                    <div className="col-12 mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" value={data.productName} onChange={e => changeInput(e, 'productName')}/>
                    </div>
                    <div className="col-12 mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="5" onChange={e => changeInput(e, 'description')}
                                  defaultValue={data.description}/>
                    </div>
                    <div className="col-md-12 mb-3">
                        <label className="form-label">Brand</label>
                        <input type="text" className="form-control" value={data.brand} onChange={e => changeInput(e, 'brand')}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemEditOptions;		