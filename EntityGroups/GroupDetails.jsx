import React, { useEffect, useState } from "react";
import { BsLightningCharge } from "react-icons/bs";
import { MdEventNote, MdTableChart } from "react-icons/md";
import Form from "react-bootstrap/Form";
import Edit from "../../images/icons/edit.png";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import NavBar from "../NavBar/NavBar";
import GroupFeatures from "./GroupFeatures";
import { useParams } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import "./EntityGroups.scss";
import AddDeviceForm from "./AddDeviceForm";


const EntityGroups = () => {
    document.title = "Entity Groups - POWERGrid Cloud";

    const [active, setActive] = useState(0);
    const [data, setData] = useState();
    const [groupData, setGroupData] = useState();
    const [modalShow, setModalShow] = useState();
    const [componentList, setComponentList] = useState();

    const params = useParams()
    const { groupId } = params

    const history = useHistory();

    const getDeviceDetails = () => {
        axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/v2/cloud_relay`, {
            header: {
                "json-version": "v1.00",
                "sender": {
                    "component": "app",
                    "id": "ddvdsv",
                    "version": "v0.1",
                    "timestamp": "CURRENT-TIME"
                },
        
                "receiver": {
                    "component": "board",
                    "id": "A4E57CE07ACC",
                    "version": "v0.1",
                    "timestamp": "CURRENT-TIME"
                },
        
                "message": {
                    "id": "unique-message-identifier",
                    "type": "wallbox_action",
                    "topic": "Component.ComponentGroupRelation.view",
                    "component": "server"
                }
            },
            body: {
                "operation": {"group_id":groupId}
            },
        },
        {
            headers: {
                Authorization: "Bearer " + Cookies.get("access_token"),
            },
        })
        .then(function (response) {
            if (response?.data) {
                setData(response?.data?.data.data)
            } else {
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    };

    const getGroupDetail = () => {
        axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/v2/cloud_relay`, {
            header: {
                "json-version": "v1.00",
                "sender": {
                    "component": "app",
                    "id": "ddvdsv",
                    "version": "v0.1",
                    "timestamp": "CURRENT-TIME"
                },
                "receiver": {
                    "component": "board",
                    "id": "A4E57CE07ACC",
                    "version": "v0.1",
                    "timestamp": "CURRENT-TIME"
                },
                "message": {
                    "id": "unique-message-identifier",
                    "type": "wallbox_action",
                    "topic": "Component.ComponentGroup.view",
                    "component": "server"
                }
            },
            body: {
                "operation": {"group_id":groupId}
            },
        },
        {
            headers: {
                Authorization: "Bearer " + Cookies.get("access_token"),
            },
        })
        .then(function (response) {
            if (response?.data) {
                setGroupData(response?.data?.data)
            } else {
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    };

    const addDevice = (data) => {
        axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/v2/cloud_relay`, {
            header: {
                "json-version": "v1.00",
                "sender": {
                    "component": "app",
                    "id": "ddvdsv",
                    "version": "v0.1",
                    "timestamp": "CURRENT-TIME"
                },
        
                "receiver": {
                    "component": "board",
                    "id": "A4E57CE07ACC",
                    "version": "v0.1",
                    "timestamp": "CURRENT-TIME"
                },
        
                "message": {
                    "id": "unique-message-identifier",
                    "type": "wallbox_action",
                    "topic": "Component.ComponentGroupRelation.create",
                    "component": "server"
                }
            },
            body: {
                "operation": {"group_id":groupId, "component_id": data.component_id}
            },
        },
        {
            headers: {
                Authorization: "Bearer " + Cookies.get("access_token"),
            },
        })
        .then(function (response) {
            if (response?.data) {
                history.push(`/groupdetails/${groupId}`)
                setModalShow(false);
            } else {
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    };

    const getComponentList = () => {
        axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/v2/cloud_relay`, {
            header: {
                "json-version": "v1.00",
                "sender": {
                    "component": "app",
                    "id": "ddvdsv",
                    "version": "v0.1",
                    "timestamp": "CURRENT-TIME"
                },
        
                "receiver": {
                    "component": "board",
                    "id": "A4E57CE07ACC",
                    "version": "v0.1",
                    "timestamp": "CURRENT-TIME"
                },
        
                "message": {
                    "id": "unique-message-identifier",
                    "type": "wallbox_action",
                    "topic": "Component.ComponentGroupRelation.all_components",
                    "component": "server"
                }
            },
            body: {
                "operation": ""
            },
        },
        {
            headers: {
                Authorization: "Bearer " + Cookies.get("access_token"),
            },
        })
        .then(function (response) {
            if (response?.data) {
                setComponentList(response?.data?.data)
            } else {
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    };

    useEffect(()=>{
        getDeviceDetails();
        getGroupDetail();
    }, [])

  return (
    <>
      <NavBar />
      <main className="wrapper">
        <div className="page-content">
          <div className="wallbox-area">
            <div className="pages-title">
              <div className="h2">Entity Grops</div>
            </div>
          </div>
          <div
            className="static-tab-bar"
            style={{
              marginTop: "30px",
            }}
          >
            {[
              { icon: <MdTableChart />, label: "Group Details" },
              {
                icon: <BsLightningCharge />,
                label: "Group Features",
              },
              { icon: <MdEventNote />, label: "Comments & History" },
            ].map((m, i) => (
              <div
                key={i}
                className={active === i ? "selected" : ""}
                onClick={() => setActive(i)}
              >
                {m.icon}
                {m.label}
              </div>
            ))}
          </div>
          
          <div>
          
            {active === 0 && (
                <>
                <div className="rounded">
                    <div className="">
                        <div className="">
                            <div className="table-componet">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="tab__content">
                                            <div className="wallbox_details_content entryGroup_details_content">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="box_group">
                                                            <div className="form-group">
                                                                <label>Group Name</label>
                                                                <div className="box_group_row">
                                                                    <input
                                                                        type="text"
                                                                        value={groupData?.name}
                                                                    />
                                                                    <span>
                                                                        <button
                                                                            className="btn-yellpow"
                                                                        >
                                                                            <img alt="" src={Edit} />&nbsp;Edit
                                                                        </button>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Group Type</label>
                                                                <Form.Select
                                                                    aria-label="Default select example"
                                                                >
                                                                    <option>
                                                                        {groupData?.type}
                                                                    </option>
                                                                </Form.Select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Group Owner</label>
                                                                <Form.Select
                                                                    aria-label="Default select example"
                                                                >
                                                                    <option>
                                                                        {groupData?.owner}
                                                                    </option>
                                                                </Form.Select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Date Created</label>
                                                                <div className="box_group_row">
                                                                    <input
                                                                        type="text"
                                                                        value={groupData?.created_at}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Group Capacity</label>
                                                                <Form.Select
                                                                    aria-label="Default select example"
                                                                >
                                                                    <option>
                                                                        {groupData?.max_device_allowed}
                                                                    </option>
                                                                </Form.Select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Installed Address</label>
                                                                <div className="box_group_row">
                                                                    <input
                                                                        type="text"
                                                                        value={`${groupData?.installed_address.address} ${groupData?.installed_address.city} ${groupData?.installed_address.postal_code}`}
                                                                    />
                                                                    <span>
                                                                        <button
                                                                            className="btn-yellpow"
                                                                        >
                                                                            <img alt="" src={Edit} />&nbsp;Edit
                                                                        </button>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="row">
                                                                <div className="col-md-3">
                                                                    <div className="box_group_row">
                                                                        <input type="text" placeholder="68169" value={groupData?.installed_address.postal_code}/>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-9">
                                                                    <div className="box_group_row">
                                                                        <input type="text" placeholder="Mannheim" value={groupData?.installed_address.city}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="table-title">
                                                        <h5>Device List</h5>
                                                        <label>5/10 Devices added to Group</label>
                                                        </div>
                                                        <table className="table box-table">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Device Name</th>

                                                                    <th scope="col" className="serialT">
                                                                        Device Serial
                                                                    </th>

                                                                    <th scope="col" className="FirmwareT">
                                                                        Date Added
                                                                    </th>

                                                                    <th scope="col" className="id">
                                                                        <span className="id">Device Status</span>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {data?.map((item, index)=>{
                                                                    return(
                                                                    <tr key={index}>
                                                                        <td>{item.device_name || "NA"}</td>
                                                                        <td>{item.device_serial || "NA"}</td>
                                                                        <td>{item.date_added || "NA"}</td>
                                                                        <td>{item.device_status}</td>
                                                                    </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </table>
                                                        <button className="btn-yellpow1 ms-auto mt-4"
                                                        onClick={()=>{
                                                            setModalShow(true);
                                                            getComponentList();
                                                        }}>
                                                            <AiOutlinePlus />&nbsp;
                                                            Add Device to Group
                                                        </button>
                                                        <div className="box_group">
                                                        <label>Group Description</label>
                                                            <div className="box_group_row">
                                                                <textarea type="text" value={groupData?.group_description} readOnly/>
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
                </>
            )}
            {active === 1 && (
              <div
                className="graphModule mt-20"
                style={{
                  background: "white",
                  borderRadius: "5px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="graphModule__inner graphModule__inner--single">
                  <div className="graphModule__graphBox">
                    <GroupFeatures />
                  </div>
                </div>
              </div>
            )}
            {active === 2 && (
                <div
                className="graphModule mt-20"
                style={{
                    background: "white",
                    borderRadius: "5px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
                >
                    <div className="graphModule__inner graphModule__inner--single">
                        <div className="graphModule__graphBox">
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
        <AddDeviceForm 
        show={modalShow}
        onHide={() => setModalShow(false)}
        callbacksubmit={addDevice}
        componentlist={componentList}
        />
      </main>
    </>
  );
};

export default EntityGroups;
