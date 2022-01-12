import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import {
  Button,
  Col,
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
import { addCardApi, deleteCardApi, deleteUserApi, getUsersDetails, updateCardApi, updateUserApi } from "../../api/api";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  Icon,
  UserAvatar,
} from "../../components/Component";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { errorToast, successToast } from "../../utils/toast";
import Transaction from "../transaction/Transaction";

const UserDetails = () => {
  const TOKEN = useSelector((state) => state?.reducer?.token);
  const userListData = useSelector((state) => state?.reducer?.userListData);
  const [data, setData] = useState({});
  const [editId, setEditedId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const [cardData, setcardData] = useState();
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [transactionData, setTransactionData] = useState([]);
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [loading, setloading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [userFormData, setUserFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [formData, setFormData] = useState({
    cardholderName: "",
    number: "",
    expirationDate: new Date(),
    cvv: "",
  });
  const [date, setDate] = useState(new Date());
  const { id } = useParams();
  const history = useHistory();
  useEffect(() => {
    // const userData = userListData?.find((item) => item?._id === id);
    // setData(userData);
    fetchUserDetails();
  }, []);
  const fetchUserDetails = async () => {
    setFetchLoading(true);
    getUsersDetails({ token: TOKEN, userId: id })
      .then((res) => {
        setData(res.data?.data?.user);
        setcardData(res.data?.data?.cards?.[0]);
        setTransactionData(res?.data?.data?.transactions ?? []);
      })
      .catch((err) => {})
      .finally(() => {
        setFetchLoading(false);
        setTransactionLoading(false);
      });
  };
  const resetForm = () => {
    setFormData({
      cardholderName: "",
      number: "",
      expirationDate: new Date(),
      cvv: "",
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };
  const onFormSubmit = (submitData) => {
    setloading(true);
    const { cardholderName, number, cvv } = submitData;
    addCardApi({
      token: TOKEN,
      data: {
        number: Number(number),
        expirationDate: moment(date).format("MM/yyyy"),
        cvv: cvv,
        cardholderName: cardholderName,
      },
      userId: data?._id,
    })
      .then((res) => {
        fetchUserDetails();
        resetForm();
        setModal({ edit: false }, { add: false });
        successToast("Card added successfully.");
      })
      .catch((err) => {
        console.log("error add card", err?.response?.data);
        if (err?.response?.data) {
          errorToast(err?.response?.data?.message);
        }
      })
      .finally(() => {
        setloading(false);
      });
  };
  const onEditSubmit = async (submitData) => {
    const { cardholderName, expirationDate } = submitData;
    setloading(true);
    updateCardApi({
      token: TOKEN,
      data: {
        cardholderName: cardholderName,
        expirationDate: moment(date).format("MM/yyyy"),
      },
      cardId: editId,
    })
      .then((res) => {
        fetchUserDetails();
        setcardData(res?.data?.data?.card);
        setModal({ edit: false });
        resetForm();
        successToast("Card updated successfully.");
      })
      .catch((err) => {
        console.log("error update user", err);
        if (err?.response?.data) {
          errorToast(err?.response?.data?.message);
        }
      })
      .finally(() => {
        setloading(false);
      });
  };

  // function that loads the want to editted data
  const onEditClick = () => {
    setDate(moment(cardData?.expirationDate, "MM/yyyy").toDate());
    setFormData({
      cardholderName: cardData?.cardholderName,
      number: "************" + cardData?.number,
      expirationDate: cardData?.expirationDate,
      cvv: "",
    });
    setModal({ edit: true }, { add: false });
    setEditedId(cardData?._id);
  };
  const deleteCard = async () => {
    setloading(true);
    deleteCardApi({ token: TOKEN, cardId: deleteId })
      .then((res) => {
        setDeleteModal(false);
        successToast("Card deleted successfully.");
        setcardData({});
      })
      .catch((err) => {
        console.log("error delete user", err);
        if (err?.response?.data) {
          errorToast(err?.response?.data?.message);
        }
      })
      .finally(() => {
        setloading(false);
      });
  };

  const suspendUser = () => {
    setloading(true);
    deleteUserApi({ token: TOKEN, userId: data?._id })
      .then((res) => {
        setDeleteUserModal(false);
        successToast("User deleted successfully.");
        history.goBack();
      })
      .catch((err) => {
        console.log("error delete user", err);
        if (err?.response?.data) {
          errorToast(err?.response?.data?.message);
        }
      })
      .finally(() => {
        setloading(false);
      });
  };
  const resetUserForm = () => {
    setUserFormData({
      firstName: "",
      lastName: "",
      email: "",
    });
  };

  // function to close the form modal
  const onUserFormCancel = () => {
    setEditUserModal(false);
    resetUserForm();
  };
  const onUserEditSubmit = async (submitData) => {
    const { firstName, lastName, email } = submitData;
    setloading(true);
    let body = { firstName: firstName, lastName: lastName, email: email };

    if (data?.email === submitData?.email) {
      delete body.email;
    }
    updateUserApi({ token: TOKEN, data: body, userId: id })
      .then((res) => {
        setData(res.data?.data?.user);
        setEditUserModal(false);
        resetUserForm();
        successToast("User updated successfully.");
      })
      .catch((err) => {
        console.log("error update user", err);
        if (err?.response?.data) {
          errorToast(err?.response?.data?.message);
        }
      })
      .finally(() => {
        setloading(false);
      });
  };

  // function that loads the want to editted data
  const onUserEditClick = () => {
    setUserFormData({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });
    setEditUserModal(true);
  };
  const { errors, register, handleSubmit } = useForm();
  if (fetchLoading && !transactionLoading) {
    return (
      <React.Fragment>
        <Head title={"Credit Manager"} />
        <Content>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              flexDirection: "column",
              height: "80vh",
            }}
          >
            <Spinner size="xl" color="dark" />
          </div>
        </Content>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <Head title={"Credit Mountain"} />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <ul className="nk-block-tools g-3">
                <li>
                  <UserAvatar
                    text={data?.firstName?.[0]?.toUpperCase() + data?.lastName?.[0]?.toUpperCase()}
                    size={"xl"}
                  />
                </li>
                <li>
                  <span>
                    <BlockTitle page tag="h3">
                      {data?.firstName + " " + data?.lastName}
                    </BlockTitle>
                    <BlockDes className="text-soft">
                      <p>{data?.email}</p>
                    </BlockDes>
                  </span>
                </li>
              </ul>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <ul className="nk-tb-actions gx-1">
                  <li>
                    <UncontrolledDropdown>
                      <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                        <Icon name="more-h"></Icon>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <ul className="link-list-opt no-bdr">
                          <li
                            onClick={() => {
                              onUserEditClick();
                            }}
                          >
                            <DropdownItem
                              tag="a"
                              href="#edit"
                              onClick={(ev) => {
                                ev.preventDefault();
                              }}
                            >
                              <Icon name="edit"></Icon>
                              <span>Edit</span>
                            </DropdownItem>
                          </li>

                          <React.Fragment>
                            <li className="divider"></li>
                            <li
                              onClick={() => {
                                {
                                  setDeleteUserModal(true);
                                }
                              }}
                            >
                              <DropdownItem
                                tag="a"
                                href="#suspend"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <Icon name="na"></Icon>
                                <span>Delete</span>
                              </DropdownItem>
                            </li>
                          </React.Fragment>
                        </ul>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </li>
                </ul>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-tools">Credit Card</div>
              </div>
            </div>

            <DataTableBody>
              <DataTableHead>
                <DataTableRow>
                  <span className="sub-text">Card Holder</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Card Number</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Expiry Date</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-right"></DataTableRow>
              </DataTableHead>
              {/*Head*/}
              {cardData?._id ? (
                <>
                  <DataTableItem key={cardData._id}>
                    <DataTableRow>
                      <div className="user-card">
                        <div className="user-info">
                          <span className="tb-lead">{cardData.cardholderName}</span>
                        </div>
                      </div>
                    </DataTableRow>
                    <DataTableRow size="mb">
                      <span className="tb-amount">************{cardData.number}</span>
                    </DataTableRow>
                    <DataTableRow size="mb">
                      <span className="tb-amount">{cardData.expirationDate}</span>
                    </DataTableRow>

                    <DataTableRow className="nk-tb-col-tools">
                      <ul className="nk-tb-actions gx-1">
                        <li>
                          <UncontrolledDropdown>
                            <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                              <Icon name="more-h"></Icon>
                            </DropdownToggle>
                            <DropdownMenu right>
                              <ul className="link-list-opt no-bdr">
                                <li onClick={() => onEditClick()}>
                                  <DropdownItem
                                    tag="a"
                                    href="#edit"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                    }}
                                  >
                                    <Icon name="edit"></Icon>
                                    <span>Edit</span>
                                  </DropdownItem>
                                </li>

                                <React.Fragment>
                                  <li className="divider"></li>
                                  <li
                                    onClick={() => {
                                      {
                                        setDeleteId(cardData?._id);
                                        setDeleteModal(true);
                                      }
                                    }}
                                  >
                                    <DropdownItem
                                      tag="a"
                                      href="#suspend"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="na"></Icon>
                                      <span>Delete</span>
                                    </DropdownItem>
                                  </li>
                                </React.Fragment>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                      </ul>
                    </DataTableRow>
                  </DataTableItem>
                </>
              ) : null}
            </DataTableBody>
            <div className="card-inner">
              {!cardData?._id ? (
                <>
                  <div className="text-center">
                    <span className="text-silent">
                      {data?.firstName + " " + data?.lastName + " has no cradit cards"}
                    </span>
                  </div>
                  <div className="text-center">
                    <Button color="primary" className="btn-icon" onClick={() => setModal({ add: true })}>
                      <span style={{ marginInline: 5, paddingLeft: 5 }}>
                        <Icon name="plus"></Icon>{" "}
                      </span>
                      <span style={{ marginInline: 5, paddingRight: 5 }}>Add Credit Card</span>
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          </DataTable>
        </Block>
        {transactionData?.length ? (
          <Transaction
            transactionData={transactionData}
            setTransactionData={setTransactionData}
            fetchdata={() => {
              setTransactionLoading(true);
              fetchUserDetails();
            }}
          />
        ) : null}
      </Content>
      <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <a
            href="#close"
            onClick={(ev) => {
              ev.preventDefault();
              onFormCancel();
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">Add Card</h5>
            <div className="mt-4">
              <Form className="row gy-4" noValidate onSubmit={handleSubmit(onFormSubmit)}>
                <Col md="12">
                  <FormGroup>
                    <label className="form-label">Card Holder Name</label>
                    <input
                      className="form-control"
                      type="text"
                      name="cardholderName"
                      defaultValue={formData.cardholderName}
                      placeholder="Enter card holder name"
                      ref={register({ required: "This field is required" })}
                    />
                    {errors.cardholderName && <span className="invalid">{errors.cardholderName.message}</span>}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <label className="form-label">Card Number</label>
                    <input
                      className="form-control"
                      type="text"
                      name="number"
                      defaultValue={formData.number}
                      placeholder="Enter  16 digit card number"
                      ref={register({
                        required: "This field is required",
                        maxLength: { value: 16, message: "Invailid card number." },
                      })}
                    />
                    {errors.number && <span className="invalid">{errors.number.message}</span>}
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label className="form-label">Expiry Date</label>
                    <ReactDatePicker
                      selected={date}
                      onChange={(value) => {
                        setDate(moment(value.toUTCString()).toDate());
                      }}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      className="form-control date-picker"
                    />
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup>
                    <label className="form-label">CVV</label>
                    <input
                      className="form-control"
                      type="number"
                      name="cvv"
                      defaultValue={formData.cvv}
                      placeholder="Enter cvv"
                      maxLength={3}
                      ref={register({
                        required: "This field is required",
                        maxLength: { value: 4, message: "Invailid card number." },
                        minLength: { value: 4, message: "Invailid card number." },
                      })}
                    />
                    {errors.cvv && <span className="invalid">{errors.cvv.message}</span>}
                  </FormGroup>
                </Col>

                <Col size="12">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    <li>
                      <Button color="primary" size="md" type="submit">
                        Add Card
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
      <Modal isOpen={modal.edit} toggle={() => setModal({ edit: false })} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <a
            href="#close"
            onClick={(ev) => {
              ev.preventDefault();
              onFormCancel();
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">Update Card</h5>
            <div className="mt-4">
              <Form className="row gy-4" noValidate onSubmit={handleSubmit(onEditSubmit)}>
                <Col md="12">
                  <FormGroup>
                    <label className="form-label">Card Holder Name</label>
                    <input
                      className="form-control"
                      type="text"
                      name="cardholderName"
                      defaultValue={formData.cardholderName}
                      placeholder="Enter card holder name"
                      ref={register({ required: "This field is required" })}
                    />
                    {errors.cardholderName && <span className="invalid">{errors.cardholderName.message}</span>}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <label className="form-label">Card Number</label>
                    <input
                      className="form-control"
                      type="text"
                      name="number"
                      disabled
                      defaultValue={formData.number}
                      placeholder="Enter  16 digit card number"
                      ref={register({ required: "This field is required" })}
                    />
                    {errors.number && <span className="invalid">{errors.number.message}</span>}
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label className="form-label">Expiry Date</label>

                    <ReactDatePicker
                      selected={date}
                      onChange={(value) => {
                        // console.log("dataaa", value.toUTCString());
                        setDate(moment(value.toUTCString()).toDate());
                      }}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      className="form-control date-picker"
                    />
                  </FormGroup>
                </Col>

                <Col md="12">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    <li>
                      <Button color="primary" size="md" type="submit">
                        Update Card
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
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <a
            href="#cancel"
            onClick={(ev) => {
              ev.preventDefault();
              setDeleteModal(false);
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="p-2">
            <h4 className="title">Delete Card</h4>
            <div className="mt-4">
              <div style={{ paddingBottom: 30 }}>
                <Col size={"12"}>
                  <h5 className="title">Are you sure, you want to delete this card?</h5>
                </Col>
              </div>
              <Col size="12">
                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                  <li>
                    <Button color="danger" size="md" onClick={() => deleteCard()}>
                      Delete
                      {loading && <Spinner style={{ height: 15, width: 15 }} />}
                    </Button>
                  </li>
                  <li>
                    <a
                      href="#cancel"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setDeleteModal(false);
                      }}
                      className="link link-light"
                    >
                      Cancel
                    </a>
                  </li>
                </ul>
              </Col>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={editUserModal} toggle={() => setEditUserModal(false)} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <a
            href="#cancel"
            onClick={(ev) => {
              ev.preventDefault();
              onUserFormCancel();
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">Update User</h5>
            <div className="mt-4">
              <Form className="row gy-4" onSubmit={handleSubmit(onUserEditSubmit)}>
                <Col md="6">
                  <FormGroup>
                    <label className="form-label">First Name</label>
                    <input
                      className="form-control"
                      type="text"
                      name="firstName"
                      defaultValue={userFormData.firstName}
                      placeholder="Enter first name"
                      ref={register({ required: "This field is required" })}
                    />
                    {errors.firstName && <span className="invalid">{errors.firstName.message}</span>}
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label className="form-label">Last Name</label>
                    <input
                      className="form-control"
                      type="text"
                      name="lastName"
                      defaultValue={userFormData.lastName}
                      placeholder="Enter last name"
                      ref={register({ required: "This field is required" })}
                    />
                    {errors.lastName && <span className="invalid">{errors.lastName.message}</span>}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      type="text"
                      name="email"
                      defaultValue={userFormData.email}
                      placeholder="Enter email"
                      ref={register({
                        required: "This field is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "invalid email address",
                        },
                      })}
                    />
                    {errors.email && <span className="invalid">{errors.email.message}</span>}
                  </FormGroup>
                </Col>

                <Col size="12">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    <li>
                      <Button color="primary" size="md" type="submit">
                        Update User
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
      <Modal
        isOpen={deleteUserModal}
        toggle={() => setDeleteUserModal(false)}
        className="modal-dialog-centered"
        size="lg"
      >
        <ModalBody>
          <a
            href="#cancel"
            onClick={(ev) => {
              ev.preventDefault();
              setDeleteUserModal(false);
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="p-2">
            <h4 className="title">Delete User</h4>
            <div className="mt-4">
              <div style={{ paddingBottom: 30 }}>
                <Col size={"12"}>
                  <h5 className="title">Are you sure, you want to delete this user?</h5>
                </Col>
              </div>
              <Col size="12">
                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                  <li>
                    <Button color="danger" size="md" onClick={() => suspendUser(deleteId)}>
                      Delete User
                      {loading && <Spinner style={{ height: 15, width: 15 }} />}
                    </Button>
                  </li>
                  <li>
                    <a
                      href="#cancel"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setDeleteUserModal(false);
                      }}
                      className="link link-light"
                    >
                      Cancel
                    </a>
                  </li>
                </ul>
              </Col>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default UserDetails;
