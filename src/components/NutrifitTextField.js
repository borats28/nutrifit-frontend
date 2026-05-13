import React from "react";

const NutrifitInputField = React.memo((props) => {
    return <div className="form-group mb-3">
        <label className="fw-bold text-secondary small mb-1">{props.label}</label>
        <input
            type={props.type}
            className="form-control form-control-lg bg-light border-0"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            required
        />
    </div>
});

export default NutrifitInputField;