import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BsLightningCharge } from "react-icons/bs";
import { MdEventNote, MdTableChart } from "react-icons/md";
import {Link } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { AiOutlinePlus } from "react-icons/ai";
import Edit from "../../images/icons/edit.png";
import PaginationComponent from "../common/Pagination";
import Search from "../common/Search";
import GroupFeatures from "./GroupFeatures";
import "./EntityGroups.scss";
import Cookies from "js-cookie";
import EntityGroupsForm from "./EntityGroupsForm";

const initState = { id: 0, name: "", type: "", group_description: "", max_device_allowed: "", owner: "", installed_address: "" };

const EntityGroups = () => {
  document.title = "Entity Groups - POWERGrid Cloud";

  const [data, setData] = useState([]);
  const [owner, setOwner] = useState([]);
  const [groupTypes, setGroupTypes] = useState([]);
  const [isProcess, setIsProcess] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [orderWay, setOrderWay] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [displaySize, setDisplaySize] = useState(20);
  const [sorting, setSorting] = useState("created_at");
  const [totalGroupCount, setTotalGroupCount] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [groupData, setGroupData] = useState(initState);
  const [location, setLocation] = useState({});
  const [message, setMessage] = useState("");
  const [wallboxAddress, setWallboxAddress] = useState();
  const [addressGroup, setAddressGroup] = useState()
  const [isAddressEditable, setIsAddressEditable] = useState(true);

  const onOrderChange = () => {
    if (orderWay === "desc") {
      setOrderWay("asc");
    } else {
      setOrderWay("desc");
    }
  };

  const setGroupAddress = (e) => {
    e.preventDefault();
    setIsAddressEditable(!isAddressEditable);
  };

  const getGroupList = () => {
    const pageSizeInt = parseInt(displaySize);
    setIsProcess(true);
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
        "operation": {"page_size": pageSizeInt, "page":currentPage, "sort_by":sorting, "sort_order":orderWay, "search_by": searchValue}
      },
    },
    {
      headers: {
        Authorization: "Bearer " + Cookies.get("access_token"),
      },
    })
    .then(function (response) {
      if (response?.data) {
        setData(response?.data?.data?.data);
        const totalGroups = response?.data?.data?.total_count;
        if (totalGroups) {
          setTotalGroupCount(totalGroups);
          setPageCount(Math.ceil(totalGroups / displaySize));
        }
        setIsProcess(false);
      } else {
        setData([]);
        setIsProcess(false);
      }
    })
    .catch(function (error) {
      setData([]);
      setIsProcess(false)
      console.log(error);
    });
  };

  const getGroupListById = (id) => {
    setIsProcess(true);
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
        "operation": {"group_id":id}
      },
    },
    {
      headers: {
        Authorization: "Bearer " + Cookies.get("access_token"),
      },
    })
    .then(function (response) {
      if (response?.data) {
        setAddressGroup(response.data.data.installed_address);
        setLocation(response.data.data.installed_address.location)
      } else {
        setIsProcess(false);
      }
    })
    .catch(function (error) {
      setIsProcess(false)
      console.log(error);
    });
  };

  const getWallboxAddress = (id) => {
    setIsProcess(true);
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
          "topic": "Component.ComponentGroup.get_wallbox_address",
          "component": "server"
        }
      },
      body: {
        "operation": {"group_id":id}
      },
    },
    {
      headers: {
        Authorization: "Bearer " + Cookies.get("access_token"),
      },
    })
    .then(function (response) {
      if (response?.data) {
        setWallboxAddress(response?.data?.data)
      } else {
        setIsProcess(false);
      }
    })
    .catch(function (error) {
      setIsProcess(false)
      console.log(error);
    });
  };

  const getOwners = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/pv2/wallbox_owners`, {
      headers: {
        Authorization: "Bearer " + Cookies.get("access_token"),
      },
    })
    .then(function (response) {
      if (response?.data?.success) {
        setOwner([...response.data.data]);
      } else {
        setOwner([]);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  const getGroupTypes = () => {
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
            "topic": "Component.ComponentGroupType.view",
            "component": "server"
        }
      },
      body: {
          "operation": ""
      }
    },
    {
      headers: {
        Authorization: "Bearer " + Cookies.get("access_token"),
      },
    })
    .then(function (response) {
      if (response?.data) {
        setGroupTypes([...response.data]);
      } else {
        setGroupTypes([]);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  const addGroup = (data, groupAddress) => {
    if (data.type && data.owner === null){
      setMessage("Please select atleast one option")
    }else{
      setIsProcess(true);
      if (Object.keys(groupAddress).length > 0) {
        data["city"] = "";
        data["street"] = "";
        data["postal_code"] = "";
        data["address1"] = "";
        data["state"] = "";
        data["location"] = "";

        groupAddress.address_components.forEach((element) => {
          if (groupAddress.name) {
            data["address1"] = groupAddress.name;
          }
          if (
            element?.types?.includes("route") ||
            element?.types?.includes("sublocality_level_1")
          ) {
            if (element?.types?.includes("street_number")) {
              data["street_number"] = element.long_name;
            }
            if (element?.types?.includes("route")) {
              data["street"] = element.long_name;
            }
          }
          if (
            element?.types?.includes("administrative_area_level_3")
              ? element.types.includes("administrative_area_level_3")
              : element.types.includes("administrative_area_level_2")
          ) {
            data["city"] = element.long_name;
          }
          if (element?.types?.includes("administrative_area_level_1")) {
            data["state"] = element.long_name;
          }
          if (element?.types?.includes("postal_code")) {
            data["postal_code"] = element.long_name;
          }
        });

        data["location"] = {
          lat: groupAddress.geometry.location.lat(),
          lng: groupAddress.geometry.location.lng(),
        };

        if (!data.street) {
          if (Object.keys(groupAddress).length > 0) {
            groupAddress.address_components.forEach((element) => {
              if (element?.types?.includes("sublocality_level_1")) {
                data["street"] = element.long_name;
              }
            });
          }
        }

        if (data.street_number) {
          data["street"] += `, ${data.street_number}`;
          delete data["street_number"];
        }
      }
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
              "topic": "Component.ComponentGroup.create",
              "component": "server"
          }
        },
        body: {
            "operation": {"name":data.name, "type": data.type, "group_description": data.group_description, "max_device_allowed": data.max_device_allowed, "owner": data.owner, "installed_address": {"city":data.city,"street":data.street, "postal_code":data.postal_code,"address1":data.address1, "state":data.state, "location":data.location}}
        }
      },
      {
        headers: {
          Authorization: "Bearer " + Cookies.get("access_token"),
        },
      })
      .then(function (response) {
        if (response?.data) {
          getGroupList();
          setModalShow(false);
          setData([...response.data]);
          setIsProcess(false);
        } else {
          setData([]);
          setIsProcess(false);
        }
      })
      .catch(function (error) {
        setData([]);
        setIsProcess(false);
        console.log(error);
      });
    }
  };

  const updateGroup = (data) => {
    if (data.type && data.owner === null){
      setMessage("Please select atleast one option")
    }else{
      setIsProcess(true);
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
              "topic": "Component.ComponentGroup.update",
              "component": "server"
          }
        },
        body: {
            "operation": { "group_id": data.id, "name":data.name, "type": data.type, "group_description": data.group_description, "max_device_allowed": data.max_device_allowed, "owner": data.owner, "installed_address": data.installed_address}
        }
      },
      {
        headers: {
          Authorization: "Bearer " + Cookies.get("access_token"),
        },
      })
      .then(function (response) {
        if (response?.data) {
          getGroupList();
          setModalShow(false);
          setData([...response.data]);
          setIsProcess(false);
        } else {
          setData([]);
          setIsProcess(false);
        }
      })
      .catch(function (error) {
        setData([]);
        setIsProcess(false);
        console.log(error);
      });
    }
  };

  const handleSubmit = (data, groupAddress) => {
    if (data.name !== '' && data.type !== '' && data.group_description !== '' && data.max_device_allowed !== '' && data.owner !== '' && data.address1 !== '') {
      if (data?.id != 0) {
        updateGroup(data);
      } else {
        addGroup(data, groupAddress);
      }
    }
  };

  const [active, setActive] = useState(0);

  useEffect(()=>{
    getGroupList();
  }, [displaySize, currentPage, sorting, orderWay, searchValue])

  return (
    <>
      <NavBar />
      <main className="wrapper">
        <div className="page-content">
          <div className="wallbox-area">
            <div className="pages-title">
              <div className="h2">Entity Groups</div>
            </div>
          </div>
          <div
            className="static-tab-bar"
            style={{
              marginTop: "30px",
            }}
          >
            {[
              { icon: <MdTableChart />, label: "Overview Groups" },
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
                <div className="search-filter">
                  <Search
                    setSearchValue={setSearchValue}
                    placeholder="Search Release Notes..."
                    onOrderChange={onOrderChange}
                    setDisplaySize={setDisplaySize}
                    setSorting={setSorting}
                    setCurrentPage={setCurrentPage}
                    sortOpt={["created_at", "id", "name"]}
                  />
                  <div className="serialT">
                    <button className="btn-yellpow1"
                      onClick={() => {
                        setGroupData(initState);
                        setModalShow(true);
                        getOwners();
                        getGroupTypes();
                      }}
                    >
                      <AiOutlinePlus />
                      Add Group
                    </button>
                  </div>
                </div>
                <div className="rounded">
                    <div className="">
                        <div className="">
                            <div className="table-componet">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="tab__content entryGroup__content">
                                            <table className="table box-table">
                                            <thead>
                                                <tr>
                                                <th scope="col">Group ID</th>

                                                <th scope="col" className="serialT">
                                                    Group Name
                                                </th>

                                                <th scope="col" className="FirmwareT">
                                                    Group Type
                                                </th>

                                                <th scope="col" className="id">
                                                    <span className="id">Active Group Features</span>
                                                </th>

                                                <th scope="col" className="functionsT">
                                                    Device Count
                                                </th>
                                                <th scope="col" className="ownerT">
                                                    Created At
                                                </th>
                                                <th scope="col" className="actionsT">
                                                    Actions
                                                </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                              {data?.map((item, index)=>{
                                                return(
                                                  <tr key={index}>
                                                    <td>{item.id}</td>
                                                    <td className="wallboxSerial">
                                                      <span>
                                                        <Link to={`/groupdetails/${item?.id}`}>{item.name}</Link>
                                                      </span>
                                                    </td>
                                                    <td>{item.type}</td>
                                                    <td>{item.Active_group_features}</td>
                                                    <td>{item.device_count}</td>
                                                    <td>{item.created_at}</td>
                                                    <td className="box_group_row">
                                                    <button
                                                    className="btn-yellpow1"
                                                    style={{ borderRadius: "6px" }}
                                                    onClick={() => {
                                                      setGroupData(item);
                                                      setModalShow(true);
                                                      getOwners();
                                                      getGroupTypes();
                                                      getWallboxAddress(item?.id);
                                                      getGroupListById(item?.id);
                                                    }}
                                                    >
                                                        <img alt="" src={Edit} />&nbsp;Edit Group
                                                    </button>
                                                    </td>
                                                  </tr>
                                                )
                                              })}
                                            </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <PaginationComponent
                                  totalLength={data?.length}
                                  totalCount={totalGroupCount}
                                  setCurrentPage={setCurrentPage}
                                  pageCount={pageCount}
                                />
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
        <EntityGroupsForm
          show={modalShow}
          onHide={() => setModalShow(false)}
          data={groupData}
          callbacksubmit={handleSubmit}
          owner={owner}
          wallboxaddress={wallboxAddress}
          grouptypes={groupTypes}
          location={location}
          setgroupaddress={setGroupAddress}
          addressgroup={addressGroup}
          isaddresseditable={isAddressEditable}
          isProcess={isProcess}
          message={message}
        />
      </main>
    </>
  );
};

export default EntityGroups;