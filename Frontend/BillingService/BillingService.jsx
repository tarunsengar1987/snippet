import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Delete from "../../images/icons/bin.png";
import update from "../../images/icons/update.png";
import { getPermission } from "../../utils";
import NavBar from "../NavBar/NavBar";
import BillingServiceForm from "./AddBillingService/AddBillingService";
import { AiOutlinePlus } from "react-icons/ai";
import "./BillingService.scss";
import Search from "../common/NewSearch";
import PaginationComponent from "../common/Pagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SendIcon from '../common/svg/SendIcon';
import UpdateIcon from '../common/svg/UpdateIcon';
import DeleteIcon from '../common/svg/DeleteIcon';
import RowSkeleton from "../common/RowSkeleton";

import { IoMdMail, IoMdAdd } from 'react-icons/io';
import { IoCalendarClear } from 'react-icons/io5';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, CheckboxGroup, Checkbox, Input, Progress } from "@nextui-org/react";

import { DateRange } from 'react-date-range';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

toast.configure();

const initState = { id: 0, wallbox_serial_number: "", email: "", is_business: true, is_single: true };

const sortOptions = [
  {
    name: 'ID',
    value: 'id'
  },
  {
    name: 'Email',
    value: 'email'
  },
  {
    name: 'Serial',
    value: 'wallbox_serial_number'
  }
]



const BillingService = () => {
  document.title = "ChargeTransactionEmail - POWERGrid Cloud";
  const [data, setData] = useState([]);
  const [isFetcing, setIsFetching] = useState(true);
  const [isNotFound, setIsNotFound] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [chargeTransactionEmail, setChargeTransactionEmail] = useState(initState);
  const [message, setMessage] = useState("");
  const [sorting, setSorting] = useState(new Set(['email']));
  const [searchValue, setSearchValue] = useState("");
  const [displaySize, setDisplaySize] = useState(new Set(['20']));
  const [orderWay, setOrderWay] = useState(new Set(['asc']));
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState();
  const [isProcess, setIsProcess] = useState(false);
  const [serials, setSerials] = useState([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: dateIsOpen, onOpen: dateOnOpen, onOpenChange: onDateOpenChange } = useDisclosure();


  const [sendEmailInput, setSendEmailInput] = useState('');
  const [sendEmailSerialNumber, setSendEmailSerialNumber] = useState('');
  const [emailTypesSelected, setEmailTypesSelected] = useState([]);
  const [sendEmailDateSelection, setSendEmailDateSelection] = useState([
    {
      startDate: startOfMonth(subMonths(new Date(), 1)),
      endDate: endOfMonth(subMonths(new Date(), 1)),
      key: 'selection'
    }
  ]);
  const [sendEmailLoading, setSendEmailLoading] = useState(false);

  const checkEmailAdd = getPermission("charge_transaction_add");
  const checkEmailUpdate = getPermission("charge_transaction_update");
  const checkEmailDelete = getPermission("charge_transaction_delete");

  useEffect(() => {
    getChargeTransactionEmail();
    return () => {
      setData([]);
    };
  }, [sorting, orderWay, searchValue, currentPage, displaySize]);




  const getChargeTransactionEmail = () => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_API_URL}/pv2/charge_transaction_email?order=${sorting.values().next().value}&order_way=${orderWay.values().next().value}&search_string=${searchValue}&page=${currentPage}&page_size=${displaySize.values().next().value}`,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("access_token"),
          },
        }
      )
      .then(function (response) {
        if (response?.data?.data) {
          setData(response?.data.data);
          setTotalDataCount(response?.data?.total_count);
          setPageCount(Math.ceil(response?.data?.total_count / displaySize.values().next().value));
          setIsFetching(false);
          setIsNotFound(false);
        } else {
          setData([])
          setIsNotFound(true);
        }
      })
      .catch(function (error) {
        if (error.response) {
          toast.error(error.response.data.detail, { autoClose: 3000 })
        }
        console.log(error);
      });
  };

  const deleteRow = (deleteEntry) => {
    const askToConfirm = window.confirm(
      `Are you sure want to Delete this Entry`
    );
    if (askToConfirm) {
      axios
        .delete(
          `${process.env.REACT_APP_BACKEND_API_URL}/pv2/charge_transaction_email?id=${deleteEntry}`,
          {
            headers: {
              Authorization: "Bearer " + Cookies.get("access_token"),
            },
          }
        )
        .then(function (response) {
          window.alert(response?.data?.message);
          getChargeTransactionEmail();
        })
        .catch(function (error) {
          if (error.response) {
            toast.error(error.response.data.detail, { autoClose: 3000 })
          }
          console.log(error);
        });
    }
  };

  const getSerial = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/pv2/wallbox_list`, {
      headers: {
        Authorization: "Bearer " + Cookies.get("access_token"),
      },
    })
      .then(function (response) {
        if (response?.data) {
          setSerials(response.data.data);
        } else {
          setSerials([]);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function validateEmail(email) {
    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  }

  const saveAPI = (data) => {
    if (data.wallbox_serial_number == "") {
      setMessage("Please select serial number")
    } else {
      if (validateEmail(data.email)) {
        setIsProcess(true);
        axios
          .post(
            `${process.env.REACT_APP_BACKEND_API_URL}/pv2/charge_transaction_email`,
            data,
            {
              headers: {
                Authorization: "Bearer " + Cookies.get("access_token"),
              },
            }
          )
          .then(function (response) {
            setModalShow(false);
            if (response?.data.status) {
              setIsProcess(false);
              getChargeTransactionEmail();
              toast.success("Record Added Successfuly", { autoClose: 3000 });
            } else {
              // alert(response?.data.message);
              toast.error(response.data.message, { autoClose: 3000 });
            }
          })
          .catch(function (error) {
            if (error.response) {
              toast.error(error.response.data.detail, { autoClose: 3000 })
            }
            console.log(error);
          })
          .then(function () {
            setIsProcess(false);
          });
      }
    }
  };


  const updateAPI = (data) => {
    if (validateEmail(data.email)) {
      setIsProcess(true);
      axios
        .put(
          `${process.env.REACT_APP_BACKEND_API_URL}/pv2/charge_transaction_email`,
          data,
          {
            headers: {
              Authorization: "Bearer " + Cookies.get("access_token"),
            },
          }
        )
        .then(function (response) {
          setModalShow(false);
          if (response?.data.status) {
            setIsProcess(false);
            getChargeTransactionEmail();
            toast.success("Record Updated Successfully", { autoClose: 3000 });
          } else {
            // alert(response?.data.message);
            toast.error(response.data.message, { autoClose: 3000 });
          }
        })
        .catch(function (error) {
          if (error.response) {
            toast.error(error.response.data.detail, { autoClose: 3000 })
          }
          console.log(error);
        })
        .then(function () {
          setIsProcess(false);
        });
    }
  };

  const handleSubmit = (data) => {
    if (data.wallbox_serial_number !== '' && data.email !== '') {
      if (data?.id > 0) {
        updateAPI(data);
      } else {
        saveAPI(data);
      }
    }
  };

  const sendEmailHandler = (email, serial_number, is_business, is_transactions) => {
    setSendEmailInput(email);
    setSendEmailSerialNumber(serial_number);
    const arr = [];
    if (is_business) {
      arr.push('is_business');
    }
    if (is_transactions) {
      arr.push('is_transactions');
    }
    setEmailTypesSelected(arr);
    setSendEmailDateSelection([
      {
        startDate: startOfMonth(subMonths(new Date(), 1)),
        endDate: endOfMonth(subMonths(new Date(), 1)),
        key: 'selection'
      }
    ])
    onOpen();
  }

  const formatDateToCustom = (date) => {
    return format(date, 'dd-MMM-yyyy').toLowerCase();
  }

  function formatDateForAPI(date) {
    return format(date, 'yyyy-MM-dd');
  }

  const initiateSendEmail = async () => {
    try {

      console.log("check seleciton is ", emailTypesSelected);

      setSendEmailLoading(true);
      const data = {
        serial_numbers: [sendEmailSerialNumber],
        email: sendEmailInput,
        date_from: formatDateForAPI(sendEmailDateSelection[0].startDate),
        date_to: formatDateForAPI(sendEmailDateSelection[0].endDate),
        is_business: emailTypesSelected.includes('is_business'),
        is_transactions: true,
        is_volume: false,
      }
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_API_URL}/send_billing_emails`,
          data,
          {
            headers: {
              Authorization: "Bearer " + Cookies.get("access_token"),
            },
          }
        )
      toast.success("Email has been sent successfuly", { autoClose: 3000 });
      setSendEmailLoading(false);
      onOpenChange(false);
    } catch (err) {
      toast.error("Something went wrong!", { autoClose: 3000 });
    }
  }


  return (
    <>

      {
        sendEmailLoading && (
          <div className="fixed top-0 bottom-0 right-0 left-0 z-[1000] cursor-not-allowed" />
        )
      }

      <NavBar />
      <main className="wrapper bg-white">
        <div className="page-content">
          <div className="wallbox-area">
            <div className="pages-title">
              <div className="h2">Billing Service</div>
              <span>Manage recipients</span>
            </div>
            <div
              className="search-filter"
              style={{
                width: "100%",
              }}
            >
              <Search
                setSearchValue={setSearchValue}
                placeholder="Search Permission Seeding"
                setCurrentPage={setCurrentPage}
                sorting={sorting}
                setSorting={setSorting}
                sortOptions={sortOptions}
                displaySize={displaySize}
                setDisplaySize={setDisplaySize}
                orderWay={orderWay}
                setOrderWay={setOrderWay}
              />
              <div className="serialT">
                {checkEmailAdd === true ? (
                  <Button
                    size="lg"
                    radius="md"
                    color="primary"
                    variant="flat"
                    startContent={<IoMdAdd className="text-primary_100  text-2xl" />}
                    onClick={() => {
                      getSerial();
                      setChargeTransactionEmail(initState);
                      setModalShow(true);
                    }}
                  >
                    Add Recipient
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="table-componet" style={{ display: "contents" }}>
              <div className="col-md-12">
                <div className="col-md-12">
                  <div className="tab__content mt-2 shadow-table rounded-2xl px-4 pb-4">
                    <table className="table box-table">
                      <thead>
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col" className="serialT">
                            Email
                          </th>

                          <th scope="col" className="FirmwareT">
                            Serial
                          </th>

                          <th scope="col" className="FirmwareT">
                            Single Transaction
                          </th>

                          <th scope="col" className="FirmwareT">
                            Transactions Overview
                          </th>

                          <th scope="col" className="FirmwareT">
                            Business Overview
                          </th>

                          <th scope="col" className="functionsT">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isFetcing ? (
                          <RowSkeleton col={7} />
                        ) : isNotFound ? (
                          <tr
                            style={{
                              borderTop: "1px solid #ccc",
                              paddingTop: "2em",
                            }}
                          >
                            <td colSpan={5}>
                              <p
                                style={{ textAlign: "center", width: "100%" }}
                                className="text-center text-muted"
                              >
                                No Record Found
                              </p>
                            </td>
                          </tr>
                        ) : (
                          data?.map((item, i) => {
                            return (
                              <BillingServiceRow
                                checkEmailDelete={checkEmailDelete}
                                checkEmailUpdate={checkEmailUpdate}
                                deleteRow={deleteRow}
                                getSerial={getSerial}
                                setModalShow={setModalShow}
                                setChargeTransactionEmail={setChargeTransactionEmail}
                                item={item}
                                key={i}
                                sendEmailHandler={sendEmailHandler}
                              />
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BillingServiceForm
          show={modalShow}
          onHide={() => setModalShow(false)}
          data={chargeTransactionEmail}
          serials={serials}
          callBackSubmit={handleSubmit}
          isProcess={isProcess}
          message={message}
        />
        <PaginationComponent
          totalLength={data.length}
          totalCount={totalDataCount}
          setCurrentPage={setCurrentPage}
          pageCount={pageCount}
        />


        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Send Email</ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    color="primary"
                    endContent={
                      <IoMdMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Email"
                    placeholder="Enter your email"
                    variant="bordered"
                    value={sendEmailInput}
                    onChange={(e) => setSendEmailInput(e.target.value)}
                  />
                  <div
                    onClick={onDateOpenChange}
                  >
                    <Input
                      color="primary"
                      endContent={
                        <IoCalendarClear className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      label="Start Date"
                      placeholder="Select Start Date"
                      type="text"
                      variant="bordered"
                      className="cursor-pointer"
                      value={formatDateToCustom(sendEmailDateSelection[0].startDate)}
                      isReadOnly
                    />
                  </div>
                  <div
                    onClick={onDateOpenChange}
                  >
                    <Input
                      color="primary"
                      endContent={
                        <IoCalendarClear className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      label="End Date"
                      placeholder="Select End Date"
                      type="text"
                      variant="bordered"
                      className="cursor-pointer"
                      value={formatDateToCustom(sendEmailDateSelection[0].endDate)}
                      isReadOnly
                    />
                  </div>
                  <div className="py-2 px-1">
                    <CheckboxGroup
                      label="Select Email Type"
                      value={emailTypesSelected}
                      onValueChange={setEmailTypesSelected}
                    >
                      <Checkbox
                        value="is_transactions"
                        classNames={{
                          label: "text-small",
                        }}
                      >
                        Transactions Overview
                      </Checkbox>
                      <Checkbox
                        value="is_business"
                        classNames={{
                          label: "text-small",
                        }}
                      >
                        Business Overview
                      </Checkbox>
                    </CheckboxGroup>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <div className="w-full">
                    {
                      sendEmailLoading && (
                        <Progress
                          color="primary"
                          size="sm"
                          isIndeterminate
                          aria-label="Loading..."
                          className="w-full"
                        />
                      )
                    }
                    <div className="flex flex-row gap-2 py-4 justify-end">
                      <Button color="primary" variant="flat" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={initiateSendEmail} isLoading={sendEmailLoading}>
                        Send
                      </Button>
                    </div>
                  </div>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          isOpen={dateIsOpen}
          onOpenChange={onDateOpenChange}
          placement="center"
        >
          <ModalContent>
            {(onDateClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Select Date</ModalHeader>
                <ModalBody>
                  <DateRange
                    onChange={item => {
                      setSendEmailDateSelection([item.selection]);
                    }}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    ranges={sendEmailDateSelection}
                    rangeColors={['#051b5d']}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="flat" onPress={onDateClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>


      </main>
    </>
  );
};

const CheckMark = (
  <svg
    style={{ fill: "#3eaf7c", width: '19px', height: '21px' }}
  >
    <use xlinkHref='/svg/sprites.svg#icon-check-circle'></use>
  </svg>
)

const CloseMark = (
  <svg
    style={{ fill: '#acacac', width: '20px', height: '20px' }}
  >
    <use xlinkHref='/svg/sprites.svg#icon-close-solid'></use>
  </svg>
)

const BillingServiceRow = ({
  item,
  checkEmailUpdate,
  setChargeTransactionEmail,
  setModalShow,
  checkEmailDelete,
  deleteRow,
  getSerial,
  sendEmailHandler
}) => {
  return (
    <tr style={{ fontSize: "13px" }} className="border-bottom">
      <td>{item?.id}</td>
      <td>
        <span> {item?.email}</span>
      </td>
      <td className="serial_redirect">
        {
          item?.wallbox_serial_number && (
            <Link to={`/wallbox/${item?.wallbox_serial_number}`}><span>{item?.wallbox_serial_number}</span></Link>
          )
        }
      </td>
      <td>
        {CheckMark}
      </td>
      <td>
        {item?.is_single ? CheckMark : CloseMark}
      </td>
      <td>
        {item?.is_business ? CheckMark : CloseMark}
      </td>
      <td
        className="flex items-center space-x-2"
        style={{
          // minWidth: "max-content",
        }}
      >

        <Button
          size="sm"
          radius="md"
          className="!bg-gradient-to-tr !from-pink-500 !to-yellow-500 text-white shadow-lg"
          startContent={<SendIcon fill="white" width="18" height="18" />}
          onClick={() => {
            sendEmailHandler(item?.email, item?.wallbox_serial_number, item?.is_business, item?.is_single, false);
          }}
        >
          Send Email
        </Button>

        {checkEmailUpdate === true && (
          <Button
            size="sm"
            radius="md"
            className="!bg-gradient-to-tr !from-pink-500 !to-yellow-500 text-white shadow-lg"
            startContent={<UpdateIcon fill="white" width="20" height="20" />}
            onClick={() => {
              setChargeTransactionEmail(item)
              setModalShow(true);
              getSerial();
            }}
          >
            Update
          </Button>
        )}
        {checkEmailDelete === true && (
          <Button
            size="sm"
            radius="md"
            className="!bg-gradient-to-tr !from-pink-500 !to-yellow-500 text-white shadow-lg"
            startContent={<DeleteIcon fill="white" width="18" height="18" />}
            onClick={() => {
              deleteRow(item?.id)
            }}
          >
            Delete
          </Button>
        )}
      </td>
    </tr>
  );
};

export default BillingService;
