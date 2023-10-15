import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  addOption,
  removeOption,
  updateField,
  updateItem,
} from "../../features/panelItemSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RightPanel(props) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { status, data } = useSelector((state) => state.panelItem);

  const notifyError = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  if (status !== "succeeded" && status !== "saving") return null;

  const changeInput = (e, key) => {
    e.preventDefault();
    dispatch(updateField({ key, val: e.target.value }));
  };

  const addOptionVal = (e) => {
    if (e.keyCode === 13 && e.target.value.trim().length > 0) {
      dispatch(addOption({ val: e.target.value.trim() }));
      e.target.value = "";
    }
  };

  const removeOpt = (e, ind) => {
    e.preventDefault();
    dispatch(removeOption({ ind }));
  };

  const saving = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateItem({ id, data }));
    if (result?.payload?.success) {
      notifySuccess(result?.payload?.message);
    } else if (!result?.payload?.success) {
      notifyError(result?.payload?.message);
    }
  };

  return (
    <div className="card shadow">
      <ToastContainer />
      <div className="card-body">
        <div className="row">
          <div className="col-12 mb-3">
            <label className="form-label">Price</label>
            <input
              type="text"
              className="form-control"
              value={data?.price ?? ""}
              onChange={(e) => changeInput(e, "price")}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">MSRP</label>
            <input
              type="text"
              className="form-control"
              value={data?.msrp ?? ""}
              onChange={(e) => changeInput(e, "msrp")}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              value={data?.category ?? ""}
              onChange={(e) => changeInput(e, "category")}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Quantity</label>
            <input
              type="text"
              className="form-control"
              value={data?.availableUnits ?? ""}
              onChange={(e) => changeInput(e, "availableUnits")}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Options</label>
            <p>
              {(data?.options ?? []).map((item, ind) => (
                <Badge
                  name={item}
                  key={ind}
                  remove={(e) => removeOpt(e, ind)}
                />
              ))}
            </p>
            <input
              type="text"
              className="form-control"
              onKeyDown={addOptionVal}
            />
          </div>
          <div className="col-12 text-end">
            <Link to="/panel" className="btn btn-light me-3">
              Cancel
            </Link>
            <button
              className="btn btn-success"
              onClick={saving}
              disabled={data.status === "saving"}
            >
              {data.status === "saving" ? "Saving" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightPanel;

const Badge = ({ name, remove = () => {} }) => {
  return (
    <span className="badge rounded-pill text-bg-secondary badge-remove">
      {name}
      <i className="fas fi-br-cross-circle" onClick={remove} />
    </span>
  );
};
