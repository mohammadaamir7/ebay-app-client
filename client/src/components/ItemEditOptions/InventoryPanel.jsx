import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {updateField, updateInventoryField} from "../../features/panelItemSlice";

function RightPanel(props) {

    const dispatch = useDispatch()
    const {status, data} = useSelector(state => state.panelItem)

    if (status !== 'succeeded')
        return null

    const changeInput = (e, index) => {
        e.preventDefault()
        let inputValue = e.target.value;
        const regex = /^[0-9\b]+$/; // Only allow digits (0-9) and backspace (\b)

        if (inputValue === '' || regex.test(inputValue)) {
            inputValue *= 1
            dispatch(updateInventoryField({index, val: inputValue}))
        }
    }

    return (
        <div className="card shadow mt-3 mb-3">
            <div className="card-body">
                <h5>Inventory</h5>
                {(data?.inventory ?? []).map((item, ind) => (
                    <Option title={item.warehouse} value={item.quantity} changeInput={e => changeInput(e, ind)}
                            key={ind}/>
                ))}
            </div>
        </div>
    );
}

export default RightPanel;

const Option = ({
                    title, value, changeInput = () => {
    }
                }) => {

    return (
        <div className="row mb-3">
            <label className="col-md-3 col-form-label">{title}</label>
            <div className="col-md-9">
                <input type="text" className="form-control" value={value} onChange={changeInput}/>
            </div>
        </div>
    )
}