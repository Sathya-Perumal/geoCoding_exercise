import React from "react";
import PropTypes from "prop-types";

const InputBox = ({type,id,labelText,value,handleChange,className,...otherAttr}) =>(
    <div className={"form-group " + className}>
        <label htmlFor ={id}>{labelText}</label>
        <input
        type={type}
        className="form-control"
        id={id}
        value={value}
        onChange={handleChange}
        {...otherAttr}
        />
        
    </div>
);

InputBox.propTypes = {
   
    labelText: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired
  };

  export default InputBox;