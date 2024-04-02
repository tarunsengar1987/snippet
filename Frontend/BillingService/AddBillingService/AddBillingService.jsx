import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
// import logoCloud from "../../../images/logo/logoCloud.png";
import logo2 from "../../../images/logo/logo2.png";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

function BillingServiceForm(props) {
  const [chargeTransactionData, setChargeTransactionData] = useState({
    id: 0,
    wallbox_serial_number: "",
    email: "",
    is_business: true,
    is_single: true
  });

  useEffect(() => {
    if (props?.data) {
      setChargeTransactionData(props.data);
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
            <div className="h4">{props?.data.id ? 'Update':'Add new'} recipient for business emails </div>
            <ValidatorForm onSubmit={handleRegister}>
              <div className="form-group">
                <label className="emails">
                  <span>*</span> Email
                </label>
                <TextValidator
                  style={{
                    width: "100%",
                    height: "40px",
                  }}
                  type="text"
                  value={chargeTransactionData?.email}
                  validators={["required", "isEmail"]}
                  errorMessages={["Email is required", "Enter valid email"]}
                  onChange={(e) =>
                    setChargeTransactionData({
                      ...chargeTransactionData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="box-group" style={{marginBottom: '20px'}}>
                <label className="FirstName">
                  <span>*</span> Serial Number
                </label>
                <Autocomplete
                  style={{marginTop: '10px'}}
                  onChange={(event, value) =>
                    setChargeTransactionData({
                      ...chargeTransactionData,
                      wallbox_serial_number: value,
                    })
                  }
                  value={chargeTransactionData?.wallbox_serial_number}
                  options={ props.serials && props.serials.length > 0 ? props.serials.map((serials) => (serials)) : [] }
                  ChipProps={{ color: "primary" }}
                  renderInput={(params) => (
                    <TextField {...params} />
                  )}
                />
              </div>
              <div className="message" style={{marginBottom: '0px', marginTop: '6px', marginRight: "14px", marginLeft: "14px"}}>
                <p style={{fontSize: '0.75rem', lineHeight: 1.66, fontWeight:400, letterSpacing: "0.03333em", color: '#d32f2f', margin: 0, fontFamily: "sans-serif"}}>
                  {props.message}
                </p>
              </div>
              <div>
                <div style={{
                  fontFamily: 'Montserrat',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#686868',
                  marginBottom: '1rem'
                }}>Billing Invoices</div>

                <div style={{display:'flex', flexFlow:'column'}}>
                  <label htmlFor="check1" style={{ color: '#686868', display:'flex', alignItems:'center' }}>
                    <input
                      className="form-check-input"
                      style={{ marginRight: '0.75em', marginTop: 0, cursor: 'pointer' }}
                      type="checkbox"
                      checked={true}
                    />
                    Single Transaction
                  </label>
                  <label htmlFor="check1" style={{ marginTop: '1rem', color: '#686868', display:'flex', alignItems:'center' }}>
                    <input
                      className="form-check-input"
                      style={{ marginRight: '0.75em', cursor: 'pointer' }}
                      type="checkbox"
                      checked={chargeTransactionData.is_single}
                      onChange={(e) =>
                        setChargeTransactionData({
                          ...chargeTransactionData,
                          is_single: e.target.checked,
                        })
                      }
                    />
                    Monthly Transactions Overview
                  </label>
                  <label htmlFor="check1" style={{ marginTop: '1rem', color: '#686868', display:'flex', alignItems:'center' }}>
                    <input
                      className="form-check-input"
                      style={{ marginRight: '0.75em', marginTop: 0, cursor: 'pointer' }}
                      type="checkbox"
                      checked={chargeTransactionData.is_business}
                      onChange={(e) =>
                        setChargeTransactionData({
                          ...chargeTransactionData,
                          is_business: e.target.checked,
                        })
                      }
                    />
                    Monthly Business Overview
                  </label>
                </div>
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="subBtn"
                  style={{ gap: '12px' }}
                  onClick={() => props.callBackSubmit(chargeTransactionData)}
                >
                  <i className={`fa-solid ${props?.data.id ? 'fa-check' : 'fa-plus'}`}></i> &nbsp;{props.isProcess ? props?.data.id ? "Updating...": "Adding..." : props?.data.id ? 'Update Recepient' : 'Add Recepient'}
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

export default BillingServiceForm;
