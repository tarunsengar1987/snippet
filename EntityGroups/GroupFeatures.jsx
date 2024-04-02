import React from "react";
import Form from "react-bootstrap/Form";
import Edit from "../../images/icons/edit.png";
import Loadbalancing from "../../images/icons/loadbalancing.png";

const GroupFeatures = () => {

  return (
    <div className="rounded">
        <div className="">
            <div className="">
                <div className="table-componet">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="tab__content">
                                <div className="wallbox_details_content groupFeature_content">
                                    <div className="box_group border p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <button
                                            className="btn-yellpow2"
                                            style={{ borderRadius: "6px" }}
                                            >
                                                <img alt="" src={Loadbalancing} />&nbsp; Load Balancing
                                            </button>

                                            
                                            <div className="custom-checkbox">
                                                <label>Active</label>
                                                <label class="switch" for="checkbox">
                                                    <input type="checkbox" id="checkbox" />
                                                    <div class="slider round"></div>
                                                </label>
                                            </div>
                                        </div>
                                        
                                        

                                        <div className="form-group">
                                        <Form.Select
                                            aria-label="Default select example"
                                        >
                                            <option>
                                                1
                                            </option>
                                            <option>
                                                2
                                            </option>
                                            <option>
                                                3
                                            </option>
                                        </Form.Select>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                    <label>Timeslot duration</label>
                                                    <input type="range" class="form-range" id="customRange1" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                <label> &nbsp; </label>
                                                    <div className="box_group_row">
                                                        <input
                                                            type="text"
                                                        />
                                                        <span>
                                                            <button
                                                                className="btn-yellpow"
                                                            >
                                                                <img alt="" src={Edit} />
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-md-9">
                                                <div className="form-group">
                                                <label>Max Load Limiter</label>
                                                <input type="range" class="form-range" id="customRange1" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                <label> &nbsp; </label>
                                                    <div className="box_group_row">
                                                        <input
                                                            type="text"
                                                        />
                                                        <span>
                                                            <button
                                                                className="btn-yellpow"
                                                            >
                                                                <img alt="" src={Edit} />
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default GroupFeatures;
