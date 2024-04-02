import { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import GoogleMapReact from "google-map-react";
import Marker from "../Marker/Marker";
import logo2 from "../../images/logo/logo2.png";
import Edit from "../../images/icons/edit.png";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

function EntityGroupsForm(props) {

    const [groupData, setGroupData] = useState({
        id: 0,
        name: "",
        type: "",
        group_description: "",
        max_device_allowed: "",
        owner: "",
        installed_address: ""
    });
    const [installedAddress, setInstalledAddress] = useState({});
    const [address, setAddress] = useState("");
    const [addressLocation, setAddressLocation] = useState({
        center: {
            lat: 10.99835602,
            lng: 77.01502627,
        },
        zoom: 11,
    });

    const autoCompleteRef = useRef();
    const inputRef = useRef();

    function getReverseGeocodingData(latlng) {
        var geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ latLng: latlng }, (results, status) => {
            if (status !== window.google.maps.GeocoderStatus.OK) {
                alert(status);
            }
            if (status == window.google.maps.GeocoderStatus.OK) {
                setAddress(results[0].formatted_address);
                setAddressLocation({
                    center: {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                    },
                    zoom: 15,
                });
            }
        });
    }

    const changeAddress = () => {
        setAddress("");
    };

    useEffect(() => {
        autoCompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current,
        );
        autoCompleteRef.current.addListener("place_changed", async function () {
            const place = await autoCompleteRef.current.getPlace();
            setAddress("");
            console.log({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            });
            setInstalledAddress(place);
            setAddressLocation({
                center: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                },
                zoom: 15,
            });
        });
        if (props?.data) {
            getReverseGeocodingData(props.location)
            setGroupData(props?.data);
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
                <div className="login-form" style={{ height: "auto", padding: "0 20px" }}>
                    <div className="logo-head">
                        <div className="h4">{props?.data.id ? 'Update':'Add new'} Group </div>
                        <ValidatorForm onSubmit={handleRegister}>
                            <div className="form-group-entity">
                                <label className="name">Name</label>
                                <TextValidator
                                style={{
                                    width: "100%",
                                    height: "40px",
                                }}
                                type="text"
                                value={groupData?.name || ""}
                                validators={["required"]}
                                errorMessages={["Name is required"]}
                                onChange={(e) =>
                                setGroupData({
                                    ...groupData,
                                    name: e.target.value,
                                })
                                }
                                />
                            </div>
                            <div className="box_group form-group">
                                <label className="grouptype">Group Type</label>
                                <Autocomplete
                                    onChange={(event, value) => {
                                        setGroupData({
                                            ...groupData,
                                            type: value ? value.id : "",
                                        });
                                    }}
                                    value={
                                        groupData.type
                                            ? props.grouptypes?.find(element => element.id === groupData.type)
                                            : null
                                    }
                                    options={props.grouptypes || []}
                                    getOptionLabel={(option) => option.group_type}
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    ChipProps={{ color: "primary" }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            // label={groupData.type ? groupData.type.group_type : "Select Group Type"}
                                        />
                                    )}
                                />
                            </div>
                            <div className="form-group-entity">
                                <label className="maxdeviceallowed">Max Device Allowed</label>
                                <TextValidator
                                style={{
                                    width: "100%",
                                    height: "40px",
                                }}
                                type="text"
                                value={groupData?.max_device_allowed || ""}
                                validators={["required", "isNumber"]}
                                errorMessages={["Max Device is required", "Enter valid number"]}
                                onChange={(e) =>
                                setGroupData({
                                    ...groupData,
                                    max_device_allowed: e.target.value,
                                })
                                }
                                />
                            </div>
                            <div className="box_group form-group">
                                <label className="owner">Owner</label>
                                <Autocomplete
                                    onChange={(event, value) => {
                                        setGroupData({
                                            ...groupData,
                                            owner: value ? value.user_id : "",
                                        });
                                    }}
                                    value={
                                        groupData.owner
                                            ? props.owner?.find(element => element.user_id === groupData.owner)
                                            : null
                                    }
                                    options={props.owner || []}
                                    getOptionLabel={(option) => option.email}
                                    getOptionSelected={(option, value) => option.user_id === value.id}
                                    ChipProps={{ color: "primary" }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            // label={groupData.owner ? groupData.owner.email : "Select Group Owner"}
                                        />
                                    )}
                                />
                            </div>
                            <div className="form-group-entity">
                                <label className="name">Group Description</label>
                                <TextValidator
                                style={{
                                    width: "100%",
                                }}
                                type="text"
                                value={groupData?.group_description || ""}
                                validators={["required"]}
                                errorMessages={["Group Description is required"]}
                                onChange={(e) =>
                                setGroupData({
                                    ...groupData,
                                    group_description: e.target.value,
                                })
                                }
                                multiline
                                rows={4}
                                />
                            </div>
                            {/* <div className="box_group form-group">
                                <label className="owner">Installed Address</label>
                                <Autocomplete
                                    onChange={(event, value) => {
                                        setGroupData({
                                            ...groupData,
                                            installed_address: value ? value.id : "",
                                        });
                                    }}
                                    value={
                                        groupData.installed_address
                                            ? props?.wallboxaddress?.find(element => element.id === groupData.installed_address)
                                            : null
                                    }
                                    options={props?.wallboxaddress || []}
                                    getOptionLabel={(option) => option.address}
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    ChipProps={{ color: "primary" }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            // label={groupData.wallboxaddress ? groupData.wallboxaddress.addess : "Select Group Address"}
                                        />
                                    )}
                                />
                            </div> */}
                            {props?.data?.id ? (
                                <>
                                {/* <div className="box_group form-group" style={{display: "flex", flexDirection: "column"}}>
                                    <label>Installed Address</label>
                                    <Autocomplete
                                        onChange={(event, value) => {
                                            setGroupData({
                                                ...groupData,
                                                installed_address: value ? value.id : "",
                                            });
                                        }}
                                        value={
                                            groupData.installed_address
                                                ? props?.wallboxaddress?.find(element => element.id === groupData.installed_address)
                                                : null
                                        }
                                        options={props?.wallboxaddress || []}
                                        getOptionLabel={(option) => option.address}
                                        getOptionSelected={(option, value) => option.id === value.id}
                                        ChipProps={{ color: "primary" }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                // label={groupData.wallboxaddress ? groupData.wallboxaddress.addess : "Select Group Address"}
                                            />
                                        )}
                                    />
                                </div> */}
                                <div className="col">
                                    <div className="box_group form-group1">
                                        <label>Installed Address</label>
                                        <div className="EntityGroupRow">
                                        {props.isaddresseditable ? (
                                            <TextValidator
                                            value={`${props?.addressgroup?.address} ${props?.addressgroup?.city} ${props?.addressgroup?.postal_code}` || ""}
                                            type="text"
                                            InputProps={{ readOnly: true }}
                                            />
                                        ) : (
                                            <Autocomplete
                                                onChange={(event, value) => {
                                                    setGroupData({
                                                        ...groupData,
                                                        installed_address: value ? value.id : "",
                                                    });
                                                }}
                                                value={
                                                    groupData.installed_address
                                                        ? props?.wallboxaddress?.find(element => element.id === groupData.installed_address)
                                                        : null
                                                }
                                                options={props?.wallboxaddress || []}
                                                getOptionLabel={(option) => option.address}
                                                getOptionSelected={(option, value) => option.id === value.id}
                                                ChipProps={{ color: "primary" }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        // label={groupData.wallboxaddress ? groupData.wallboxaddress.addess : "Select Group Address"}
                                                    />
                                                )}
                                            />
                                        )}
                                            {props.isaddresseditable ? (
                                            <button
                                                className="btn-yellpow"
                                                onClick={(e) => props.setgroupaddress(e)}
                                            >
                                                <img alt="" src={Edit} />
                                            </button>
                                            ) : (
                                            <button
                                                className="btn-yellpow"
                                                onClick={(e) => props.setgroupaddress(e)}
                                            >
                                                Cancel
                                            </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                </>
                            ) : (
                                <>
                                <div className="form-group-entity" style={{display: "flex", flexDirection: "column"}}>
                                    <label className="installedAddress">Installed Address :</label>
                                    {address ? (
                                        <input style={{ width: "100%" }} value={address || ""} onChange={changeAddress} />
                                    ) : (
                                        <input style={{ width: "100%" }} ref={inputRef} />
                                    )}
                                </div><br />
                                <div style={{ height: "300px", width: "100%" }}>
                                    <GoogleMapReact
                                        bootstrapURLKeys={
                                            "AIzaSyApcRz24my_H6fqJzHD0OJ_fnau_Ut40Os"
                                        }
                                        center={addressLocation.center}
                                        zoom={addressLocation.zoom}
                                    >
                                        <Marker
                                            lat={addressLocation.center.lat}
                                            lng={addressLocation.center.lng}
                                            color="blue"
                                        />
                                    </GoogleMapReact>
                                </div>
                                </>
                            )}
                            <br />
                            <div className="form-group">
                                <button
                                type="submit"
                                className="subBtn"
                                style={{ gap: '12px' }}
                                  onClick={() => props.callbacksubmit(groupData, installedAddress)}
                                >
                                <i className={`fa-solid ${props?.data.id ? 'fa-check' : 'fa-plus'}`}></i> {props.isprocess ? props?.data.id ? "Updating...": "Adding..." : props?.data.id ? 'Update Group' : 'Add Group'}
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
};

export default EntityGroupsForm;
