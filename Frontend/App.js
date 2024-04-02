import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import { Switch } from "react-router-dom";
import PrivateRoute from "../Routes/PrivateRoute";
import AuthProvider from "../context/AuthProvider";
import AddGroup from "./AddGroup/AddGroup";
import "./App.scss";
import "./main.css";
import BillingService from "./BillingService/BillingService";
import AddCarProfile from "./CarProfile/AddCarProfile/AddCarProfile";
import ListCarProfile from "./CarProfile/ListCarProfile/ListCarProfile";
import ChangeLogs from "./ChangeLogs/ChangeLogs";
import ChargeEvents from "./ChargeEvents/ChargeEvents";
import CustomersMessages from "./CustomersMessages/CustomersMessages";
import Code2Serial from "./Docs/APIs/Code2Serial";
import Device2Serial from "./Docs/APIs/Device2Serial";
// import ReleaseNotes from "./Docs/APIs/releasenotes";
import AddReleaseNotes from "./ReleaseNotes/AddReleaseNotes/AddReleaseNotes";
import ReleaseNotes from "./ReleaseNotes/releasenotes";

import GenericFwMessage from "./Docs/APIs/GenericFwMessage";
import Serial2Code from "./Docs/APIs/Serial2Code";
import Serial2Device from "./Docs/APIs/Serial2Device";
import Serial2Sim from "./Docs/APIs/Serial2Sim";
import Sim2Serial from "./Docs/APIs/Sim2Serial";
// import SyncWallboxes from "./Docs/APIs/SyncWallboxes";
import Events from "./Events/Events";
import AddFirmware from "./Firmware/AddFirmware/AddFirmware";
import Firmware from "./Firmware/Firmware";
import Group from "./Group/Group";
import Login from "./Login/Login";
import AddMeasurement from "./Measurement/AddMeasurement/AddMeasurement";
import Measurement from "./Measurement/Measurement";
import MobileLogs from "./MobileLogs/MobileLogs";
import PowerBrain from "./PowerBrain/PowerBrain";
import ResetPassword from "./Reset_Password/ResetPassword";
import StatisticsDashboardUpdate from "./StatisticsDashboard/StatisticsDashboardUpdate";
import AddPermissionForm from "./User/AddPermission";
import ConfirmUser from "./User/ConfirmUser";
import EditWallboxUser from "./User/EditWallboxUser/EditWallboxUser";
import Permissions from "./User/Permissions";
import Roles from "./User/Roles";
import User from "./User/User";
import UserProfile from "./User/UserProfile";
import UserSingle from "./User/UserSingle";
import WallboxUser from "./User/WallboxUser";
import Permission from "./User/permission/Permission";
import UserLogControl from "./User/permission/UserLogControl";
import UserRole from "./User/permission/UserRole";
import AddWallbox from "./Wallbox/AddWallbox";
import UpdateWallbox from "./Wallbox/UpdateWallbox";
import Wallbox from "./Wallbox/Wallbox";
import WallboxComment from "./Wallbox/WallboxComment";
import WallboxSingleUpdate from "./Wallbox/WallboxSingleUpdate";
import AddChargeEvents from "./Wallbox/WallboxSingle/AddChargeEvents";
import ListFeatures from "./Features/ListFeatures/ListFeatures";
import AddFeature from "./Features/AddFeatures/AddFeatures";
import EditUserProfile from "./User/EditUserProfile";
import PermissionSeeding from "./PermissionSeeding/PermissionSeeding";
import AddPermissionSeeding from "./PermissionSeeding/AddPermissionSeeding";
import EntityGroups from "./EntityGroups/EntityGroups";
import GroupDetails from "./EntityGroups/GroupDetails";
import DeviceWebpage from "./DeviceWebpage/DeviceWebpage";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Router>
          <Switch>
            <PrivateRoute exact path="/" permission="show_wallboxes">
              <Wallbox />
            </PrivateRoute>

            <PrivateRoute
              exact
              path="/wallbox/:wallboxId"
              permission="show_wallbox_single"
            >
              <WallboxSingleUpdate />
            </PrivateRoute>

            <PrivateRoute exact path="/addchargeevents">
              <AddChargeEvents />
            </PrivateRoute>

            <PrivateRoute exact path="/addwallbox" permission="add_wallbox">
              <AddWallbox />
            </PrivateRoute>

            <PrivateRoute
              exact
              path="/updatewallbox"
              permission="wallbox_update"
            >
              <UpdateWallbox />
            </PrivateRoute>

            <PrivateRoute
              exact
              path="/chargeEvents"
              permission="show_charge_events"
            >
              <ChargeEvents />
            </PrivateRoute>

            <PrivateRoute
              exact
              path="/CustomersMessages"
              permission="show_customers_messages"
            >
              <CustomersMessages />
            </PrivateRoute>

            <PrivateRoute exact path="/users" permission="show_users">
              <User />
            </PrivateRoute>

            <PrivateRoute
              exact
              path="/user/:userID"
              permission="show_user_single"
            >
              <UserSingle />
            </PrivateRoute>

            <PrivateRoute
              exact
              path="/userprofile"
              permission="nav_user_profile"
            >
              <UserProfile />
            </PrivateRoute>

            <PrivateRoute exact path="/events" permission="show_events">
              <Events />
            </PrivateRoute>

            <PrivateRoute exact path="/permissionseeding">
              <PermissionSeeding />
            </PrivateRoute>

            <PrivateRoute exact path="/addpermissionseeding">
              <AddPermissionSeeding />
            </PrivateRoute>

            <PrivateRoute exact path="/powerbrain" permission="show_powerbrain">
              <PowerBrain />
            </PrivateRoute>

            <PrivateRoute exact path="/mobilelogs" permission="show_mobilelog">
              <MobileLogs />
            </PrivateRoute>
            <PrivateRoute exact path="/changelogs" permission="show_changelog">
              <ChangeLogs />
            </PrivateRoute>
            <Route exact path="/reset_password/:token">
              <ResetPassword />
            </Route>

            <PrivateRoute exact path="/roles" permission="show_roles">
              <Roles />
            </PrivateRoute>

            <PrivateRoute
              exact
              path="/permissions"
              permission="show_permission"
            >
              <Permissions />
            </PrivateRoute>

            <PrivateRoute
              exact
              path="/docs/sim2serial"
              permission="show_sim2serial"
            >
              <Sim2Serial />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/docs/serial2sim"
              permission="show_serial2sim"
            >
              <Serial2Sim />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/docs/Serial2Code"
              permission="show_serial2code"
            >
              <Serial2Code />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/docs/Code2Serial"
              permission="show_code2serial"
            >
              <Code2Serial />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/docs/serial2device"
              permission="show_serial2device"
            >
              <Serial2Device />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/docs/device2serial"
              permission="show_device2serial"
            >
              <Device2Serial />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/docs/genericfwmessage"
              permission="show_generic_fw_message"
            >
              <GenericFwMessage />
            </PrivateRoute>

            <PrivateRoute
              exact
              path="/releasenotes"
              permission="show_release_notes"
            >
              <ReleaseNotes />
            </PrivateRoute>

            <PrivateRoute
              exact
              path="/addreleasenote"
              permission="add_release_note"
            >
              <AddReleaseNotes />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/billingservice"
              permission="show_charge_transaction_email"
            >
              <BillingService />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/entitygroups"
            >
              <EntityGroups />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/groupdetails/:groupId"
            >
              <GroupDetails />
            </PrivateRoute>
            <PrivateRoute exact path="/firmware" permission="show_firmware">
              <Firmware />
            </PrivateRoute>
            <PrivateRoute exact path="/addfirmware" permission="add_firmware">
              <AddFirmware />
            </PrivateRoute>
            <PrivateRoute exact path="/group" permission="show_group_list">
              <Group />
            </PrivateRoute>
            <PrivateRoute exact path="/addgroup" permission="add_group">
              <AddGroup />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/measurement"
              permission="show_measurement"
            >
              <Measurement />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/addmeasurement"
              permission="add_measurements"
            >
              <AddMeasurement />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/addpermission"
              permission="add_permissions"
            >
              <AddPermissionForm />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/rolePermission"
              permission="show_permissions"
            >
              <Permission />
            </PrivateRoute>
            <PrivateRoute exact path="/userRole" permission="show_user_role">
              <UserRole />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/userlogcontrol"
              permission="show_user_log_control"
            >
              <UserLogControl />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/wallboxuser/:user_id"
              permission="show_wallbox_user"
            >
              <WallboxUser />
            </PrivateRoute>
            <PrivateRoute exact path="/wallboxcomment">
              <WallboxComment />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/statisticsdashboard"
              permission="show_statistics_dashboard"
            >
              <StatisticsDashboardUpdate />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/editwallboxuser/:user_id"
              permission="edit_wallbox_user"
            >
              <EditWallboxUser />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/listcarprofile"
              permission="show_car_profile"
            >
              <ListCarProfile />
            </PrivateRoute>
            <PrivateRoute
              exact
              path="/addcarprofile"
              permission="add_car_profile"
            >
              <AddCarProfile />
            </PrivateRoute>

            <PrivateRoute
              exact
              path="/features"
              permission="show_features"
            >
              <ListFeatures />
            </PrivateRoute>

            <PrivateRoute
              exact
              path="/addfeature"
              permission="add_features"
            >
              <AddFeature />
            </PrivateRoute>
            <PrivateRoute exact path="/edituserprofile" permission="show_user_role">
              <EditUserProfile />
            </PrivateRoute>

            <Route exact path="/login" component={Login} />
            <Route
              exact
              path="/users/confirm_user/:token"
              component={ConfirmUser}
            />
            <Route
              exact
              path="/qr/device/:token"
              component={DeviceWebpage}
            />
          </Switch>
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;
