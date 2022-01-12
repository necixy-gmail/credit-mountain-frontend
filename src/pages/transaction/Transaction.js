import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import { refundUserApi } from "../../api/api";
import { Block, Button, Col, Icon, PaginationComponent, Row, RSelect } from "../../components/Component";
import Head from "../../layout/head/Head";
import { errorToast, successToast } from "../../utils/toast";
export const statusOptions = [
  { value: "duplicate", label: "Duplicate" },
  { value: "fraudulent", label: "Fraudulent" },
  { value: "requested_by_customer", label: "Requested by customer" },
];
const Transaction = ({ transactionData, setTransactionData, fetchdata }) => {
  const TOKEN = useSelector((state) => state?.reducer?.token);

  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    add: false,
  });
  const [viewModal, setViewModal] = useState(false);
  const [detail, setDetail] = useState({});
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    reason: "duplicate",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const [refundItem, setRefundItem] = useState();
  const [loading, setloading] = useState(false);
  useEffect(() => {
    setData([...transactionData]);
  }, [transactionData]);
  const sortingFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = [...defaultData].sort((a, b) => parseFloat(a.ref) - parseFloat(b.ref));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = [...defaultData].sort((a, b) => parseFloat(b.ref) - parseFloat(a.ref));
      setData([...sortedData]);
    }
  };

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = transactionData.filter((item) => {
        return item.bill.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...transactionData]);
    }
  }, [onSearchText]);

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      amount: "",
      reason: "duplicate",
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ add: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = async (submitData) => {
    setloading(true);
    const { reason, amount } = formData;
    let body = {
      gateway: refundItem?.gateway,
      amount: Number(amount),
      reason: reason,
    };
    refundUserApi({ token: TOKEN, data: body, transactionId: refundItem?._id })
      .then((res) => {
        fetchdata();
        successToast("Success");
        resetForm();
        setModal({ add: false });
      })
      .catch((err) => {
        console.log("error", err);
        if (err?.response?.data) {
          errorToast(err?.response?.data?.message);
        }
      })
      .finally(() => {
        setloading(false);
      });
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit } = useForm();
  const calculateRefund = (refunds) => {
    let temprefund = 0;
    refunds?.forEach((item) => {
      temprefund = temprefund + item?.meta?.amount;
    });
    return temprefund;
  };
  return (
    <React.Fragment>
      <Head title="Credit Mountain"></Head>

      <Block>
        <Card className="card-bordered card-stretch">
          <div className="card-inner-group">
            <div className="card-inner">
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title">Transactions</h5>
                </div>
                <div className="card-tools mr-n1">
                  <ul className="btn-toolbar">
                    <li>
                      <Button onClick={toggle} className="btn-icon search-toggle toggle-search">
                        <Icon name="search"></Icon>
                      </Button>
                    </li>
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                          <Icon name="setting"></Icon>
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-check">
                            <li>
                              <span>Show</span>
                            </li>
                            <li className={itemPerPage === 5 ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setItemPerPage(5);
                                }}
                              >
                                5
                              </DropdownItem>
                            </li>
                            <li className={itemPerPage === 10 ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setItemPerPage(10);
                                }}
                              >
                                10
                              </DropdownItem>
                            </li>
                            <li className={itemPerPage === 15 ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setItemPerPage(15);
                                }}
                              >
                                15
                              </DropdownItem>
                            </li>
                          </ul>
                          <ul className="link-check">
                            <li>
                              <span>Order</span>
                            </li>
                            <li className={sort === "dsc" ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setSortState("dsc");
                                  sortingFunc("dsc");
                                }}
                              >
                                DESC
                              </DropdownItem>
                            </li>
                            <li className={sort === "asc" ? "active" : ""}>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setSortState("asc");
                                  sortingFunc("asc");
                                }}
                              >
                                ASC
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                  </ul>
                </div>
                <div className={`card-search search-wrap ${!onSearch ? "active" : ""}`}>
                  <div className="search-content">
                    <Button
                      className="search-back btn-icon toggle-search"
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="form-control border-transparent form-focus-none"
                      placeholder="Search by bill name"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                    />
                    <Button className="search-submit btn-icon">
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-inner p-0">
              <table className="table table-tranx">
                <thead>
                  <tr className="tb-tnx-head">
                    <th className="tb-tnx-id">
                      <span className="">Transaction Id</span>
                    </th>
                    <th className="tb-tnx-id">
                      <span className="">Amount</span>
                    </th>
                    <th className="tb-tnx-id">
                      <span className="">Description</span>
                    </th>
                    <th className="tb-tnx-id">
                      <span className="">Gateway</span>
                    </th>
                    <th className="tb-tnx-id">
                      <span className="">Date</span>
                    </th>
                    <th className="tb-tnx-id">
                      <span className="">Refund</span>
                    </th>

                    <th className="tb-tnx-action">
                      <span>&nbsp;</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0
                    ? currentItems.map((item) => {
                        return (
                          <tr key={item._id} className="tb-tnx-item">
                            <td className="tb-tnx-id">
                              <a
                                href="#ref"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>{item?.transactionId}</span>
                              </a>
                            </td>
                            <td className="tb-tnx-amount is-alt">
                              <div className="tb-tnx-total">
                                <span className="amount">{item?.meta?.amount}</span>
                              </div>
                            </td>
                            <td className="tb-tnx-amount is-alt">
                              <div className="tb-tnx-total">
                                <span className="title">{item.meta?.description ?? item?.description}</span>
                              </div>
                            </td>
                            <td className="tb-tnx-amount is-alt">
                              <div className="tb-tnx-total">
                                <span className="amount">{item.gateway}</span>
                              </div>
                            </td>
                            <td className="tb-tnx-amount is-alt">
                              <div className="tb-tnx-total">
                                <span className="amount">{moment(item?.createdAt).format("DD/MM/YYYY")}</span>
                              </div>
                            </td>
                            <td className="tb-tnx-info">
                              <div className="tb-tnx-info">
                                <span className="amount">{calculateRefund(item?.refunds)}</span>
                              </div>
                            </td>
                            <td className="tb-tnx-action">
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="text-soft dropdown-toggle btn btn-icon btn-trigger">
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-plain">
                                    <li
                                      onClick={() => {
                                        setDetail(item);
                                        setViewModal(true);
                                      }}
                                    >
                                      <DropdownItem
                                        tag="a"
                                        href="#view"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        View
                                      </DropdownItem>
                                    </li>
                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#print"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setRefundItem(item);
                                          setModal({ add: true });
                                        }}
                                      >
                                        Refund
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>
            </div>
            <div className="card-inner">
              {currentItems.length > 0 ? (
                <PaginationComponent
                  noDown
                  itemPerPage={itemPerPage}
                  totalItems={data.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">No data found</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Block>

      <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <a
            href="#cancel"
            onClick={(ev) => {
              ev.preventDefault();
              onFormCancel();
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">Refund</h5>
            <p className="title">
              Available amount for refund {parseFloat(refundItem?.meta?.amount - calculateRefund(refundItem?.refunds))}
            </p>
            <div className="mt-4">
              <Form className="row gy-4 mt-4" onSubmit={handleSubmit(onFormSubmit)}>
                <Col md="12">
                  <FormGroup>
                    <label className="form-label">Reason for Refund</label>

                    <div className="form-control-wrap">
                      <RSelect
                        options={statusOptions}
                        defaultValue={{ value: "duplicate", label: "Duplicate" }}
                        onChange={(e) => setFormData({ ...formData, reason: e.value })}
                      />
                    </div>

                    {errors.reason && <span className="invalid">{errors.reason.message}</span>}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <label className="form-label">Refund Amount </label>
                    <input
                      className="form-control"
                      ref={register({ required: "This field is required" })}
                      type="number"
                      name="amount"
                      placeholder="Enter amount"
                      defaultValue={formData.amount}
                      onChange={(e) => {
                        setFormData({ ...formData, amount: e?.target?.value });
                      }}
                    />
                    {errors.total && <span className="invalid">{errors.total.message}</span>}
                    {parseFloat(refundItem?.meta?.amount - calculateRefund(refundItem?.refunds)) <
                      parseFloat(formData?.amount) && (
                      <span className="invalid">{`Refund amount can not be more than ${parseFloat(
                        refundItem?.meta?.amount - calculateRefund(refundItem?.refunds)
                      )}`}</span>
                    )}
                  </FormGroup>
                </Col>

                <Col size="12">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    <li>
                      <Button
                        disabled={refundItem?.meta?.amount - calculateRefund(refundItem?.refunds) === 0}
                        color="primary"
                        size="md"
                        type="submit"
                      >
                        Refund
                        {loading && <Spinner style={{ height: 15, width: 15 }} />}
                      </Button>
                    </li>
                    <li>
                      <a
                        href="#cancel"
                        onClick={(ev) => {
                          ev.preventDefault();
                          onFormCancel();
                        }}
                        className="link link-light"
                      >
                        Cancel
                      </a>
                    </li>
                  </ul>
                </Col>
              </Form>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={viewModal} toggle={() => setViewModal(false)} className="modal-dialog-centered" size="xl">
        <ModalBody>
          <a
            href="#cancel"
            onClick={(ev) => {
              ev.preventDefault();
              setViewModal(false);
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="nk-modal-head">
            <h4 className="nk-modal-title title">
              Transaction <small className="text-primary"></small>
            </h4>
          </div>
          <div className="nk-tnx-details mt-sm-3">
            <Row className="gy-3">
              <Col lg={6}>
                <span className="sub-text">Transaction ID</span>
                <span className="caption-text">#{detail.transactionId}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Description </span>
                <span className="caption-text text-break">{detail?.meta?.description ?? detail?.description}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Transaction Amount</span>
                <span className="caption-text"> {detail.meta?.amount}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Currency</span>
                <span className="caption-text"> {detail.meta?.currency ?? "-"}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Gateway</span>
                <span className="caption-text"> {detail?.gateway}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Date</span>
                <span className="caption-text"> {moment(detail?.createdAt).format("DD/MM/YYYY")}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Refund</span>
                <span className="caption-text"> {calculateRefund(detail?.refunds)}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Charged User</span>
                <span className="caption-text">
                  {" "}
                  {detail?.user?.[0]?.firstName + " " + detail?.user?.[0]?.lastName}
                </span>
              </Col>
            </Row>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Transaction;
