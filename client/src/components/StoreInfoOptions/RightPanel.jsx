import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {addOption, removeOption, updateField, updateItem} from "../../features/panelItemSlice";

function RightPanel(props) {

    const {id} = useParams()
    const dispatch = useDispatch()
    const {status, data} = useSelector(state => state.panelItem)

    if (status !== 'succeeded' && status !== 'saving')
        return null

    const changeInput = (e, key) => {
        e.preventDefault()
        dispatch(updateField({key, val: e.target.value}))
    }

    const addOptionVal = (e) => {
        if (e.keyCode === 13 && e.target.value.trim().length > 0) {
            dispatch(addOption({val: e.target.value.trim()}))
            e.target.value = ""
        }
    }

    const removeOpt = (e, ind) => {
        e.preventDefault()
        dispatch(removeOption({ind}))
    }

    const saving = (e) => {
        e.preventDefault()
        dispatch(updateItem({id, data}))
    }

    return (
        <div className="card shadow">
            <div className="card-body">
                <div className="row">
                    <div className="col-12 mb-3">
                        <label className="form-label">Price</label>
                        <input type="text" className="form-control" value={data?.price ?? ''}
                               onChange={e => changeInput(e, 'price')}/>
                    </div>
                    <div className="col-12 mb-3">
                        <label className="form-label">MSRP</label>
                        <input type="text" className="form-control" value={data?.msrp ?? ''}
                               onChange={e => changeInput(e, 'msrp')}/>
                    </div>
                    <div className="col-12 mb-3">
                        <label className="form-label">Category</label>
                        <input type="text" className="form-control" value={data?.category ?? ''}
                               onChange={e => changeInput(e, 'category')}/>
                    </div>
                    <div className="col-12 mb-3">
                        <label className="form-label">Quantity</label>
                        <input type="text" className="form-control" value={data?.availableUnits ?? ''}
                               onChange={e => changeInput(e, 'availableUnits')}/>
                    </div>
                    <div className="col-12 mb-3">
                        <label className="form-label">Options</label>
                        <p>
                            {(data?.options ?? []).map((item, ind) => (
                                <Badge name={item} key={ind} remove={e => removeOpt(e, ind)}/>
                            ))}
                        </p>
                        <input type="text" className="form-control" onKeyDown={addOptionVal}/>
                    </div>
                    <div className="col-12 text-end">
                        <Link to="/panel" className="btn btn-light me-3">Cancel</Link>
                        <button className="btn btn-success"
                                onClick={saving}
                                disabled={data.status === 'saving'}>{data.status === 'saving' ? "Saving" : "Save"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RightPanel;

const Badge = ({
                   name, remove = () => {
    }
               }) => {
    return (
        <span className="badge rounded-pill text-bg-secondary badge-remove">
            {name}
            <i className="fas fi-br-cross-circle" onClick={remove}/>
        </span>
    )
}