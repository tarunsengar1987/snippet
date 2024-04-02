import { Modal } from "react-bootstrap";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import logo2 from "../../images/logo/logo2.png";
import { ValidatorForm } from "react-material-ui-form-validator";
import React, { useState, useEffect } from "react";


function AddDeviceForm(props) {
  const [deviceData, setDeviceData] = useState();

  useEffect(() => {
    if (props?.data) {
        setDeviceData(props.data);
    }
  }, [props]);

  const handleRegister = (e) => {
    e.preventDefault();
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div
          className="login-form"
          style={{ height: "auto", padding: "0 20px" }}
        >
          <div className="logo-head">
            {/* <div className="logo-2">
              <img src={logoCloud} alt="" />
            </div> */}
            <div className="h4">Add Device to group</div>
            <ValidatorForm onSubmit={handleRegister}>
              <div className="box_group form-group">
                <label className="component">
                  <span>*</span> Component
                </label>
                <Autocomplete
                  style={{marginTop: '10px'}}
                  onChange={(event, value) =>
                    setDeviceData({
                      ...deviceData,
                      component_id: value.id,
                    })
                  }
                  value={deviceData?.component_id}
                  options={props.componentlist && props.componentlist.length > 0 ? props.componentlist?.map((element)=>({id: element?.id, label: element?.serial_number})) : []}
                  ChipProps={{ color: "primary" }}
                  renderInput={(params) => (
                    <TextField {...params} />
                  )}
                />
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="subBtn"
                  style={{ gap: '12px' }}
                  onClick={() => props.callbacksubmit(deviceData)}
                >
                    <i className='fa-solid fa-plus'></i>Add Device
                  {/* <i className={`fa-solid ${props?.data.id ? 'fa-check' : 'fa-plus'}`}></i> {props.isProcess ? props?.data.id ? "Updating...": "Adding..." : props?.data.id ? 'Update Recepient' : 'Add Recepient'} */}
                </button>
              </div>
            </ValidatorForm>
          </div>
          <div className="logo-footer mt-5">
            <img src={logo2} alt="" />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddDeviceForm;
