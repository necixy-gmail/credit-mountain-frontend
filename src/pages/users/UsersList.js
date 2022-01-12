import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
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
import { addUserApi, deleteUserApi, getUsersApi, updateUserApi } from "../../api/api";
import {
  Block,
  BlockBetween,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  Col,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  Icon,
  PaginationComponent,
  UserAvatar,
} from "../../components/Component";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { setUsersListData } from "../../redux/Reducer";
import { errorToast, successToast } from "../../utils/toast";
import { findUpper } from "../../utils/Utils";
import { UserContext } from "./UserContext";

const UserList = () => {
  const { contextData } = useContext(UserContext);
  const [data, setData] = contextData;

  const [sm, updateSm] = useState(false);
  const [tablesm, updateTableSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [loading, setloading] = useState(false);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [editId, setEditedId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");

  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.name.localeCompare(b.name));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.name.localeCompare(a.name));
      setData([...sortedData]);
    }
  };
  useEffect(() => {
    getUsersList();
  }, []);
  const TOKEN = useSelector((state) => state?.reducer?.token);
  const userListData = useSelector((state) => state?.reducer?.userListData);
  const dispatch = useDispatch();
  const getUsersList = async () => {
    getUsersApi({ token: TOKEN })
      .then((res) => {
        dispatch(setUsersListData(res?.data?.data?.users));
      })
      .catch((err) => {});
  };
  useEffect(() => {
    setData([...userListData]);
  }, [userListData]);
  // unselects the data on mount
  // eslint-disable-line react-hooks/exhaustive-deps

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = userListData.filter((item) => {
        return (
          item.firstName.toLowerCase().includes(onSearchText.toLowerCase()) ||
          item.lastName.toLowerCase().includes(onSearchText.toLowerCase()) ||
          item.email.toLowerCase().includes(onSearchText.toLowerCase())
        );
      });
      setData([...filteredObject]);
    } else {
      setData([...userListData]);
    }
  }, [onSearchText, setData]);

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = (submitData) => {
    setloading(true);
    const { firstName, lastName, email } = submitData;
    addUserApi({
      token: TOKEN,
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
      },
    })
      .then((res) => {
        dispatch(setUsersListData([...userListData, res.data?.data?.user]));
        resetForm();
        setModal({ edit: false }, { add: false });
        successToast("User added successfully.");
      })
      .catch((err) => {
        if (err?.response?.data) {
          errorToast(err?.response?.data?.message);
        }
      })
      .finally(() => {
        setloading(false);
      });
  };

  // submit function to update a new item
  const onEditSubmit = async (submitData) => {
    const { firstName, lastName, email } = submitData;
    setloading(true);
    let newitems = data;
    let body = { firstName: firstName, lastName: lastName, email: email };
    let oldItem = data.find((item) => item._id === editId);
    if (oldItem?.email === submitData?.email) {
      delete body.email;
    }
    updateUserApi({ token: TOKEN, data: body, userId: editId })
      .then((res) => {
        let index = newitems.findIndex((item) => item._id === editId);
        newitems[index] = res.data?.data?.user;
        setModal({ edit: false });
        resetForm();
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
  const onEditClick = (item) => {
    setFormData({
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
    });
    setModal({ edit: true }, { add: false });
    setEditedId(item?._id);
  };

  // function to change to suspend property for an item

  const suspendUser = (id) => {
    setloading(true);
    deleteUserApi({ token: TOKEN, userId: id })
      .then((res) => {
        let newData = data?.filter((item) => item._id !== id);

        setData([...newData]);
        successToast("User updated successfully.");
        setDeleteModal(false);
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

  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Credit Mountain"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Users List
              </BlockTitle>
              {/* <BlockDes className="text-soft">
                <p>You have total 2,595 users.</p>
              </BlockDes> */}
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li className="nk-block-tools-opt">
                      <Button color="primary" className="btn-icon" onClick={() => setModal({ add: true })}>
                        <span style={{ marginInline: 5, paddingLeft: 5 }}>
                          <Icon name="plus"></Icon>{" "}
                        </span>
                        <span style={{ marginInline: 5, paddingRight: 5 }}>Add New User</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-tools">Users List</div>
                <div className="card-tools mr-n1">
                  <ul className="btn-toolbar gx-1">
                    <li>
                      <a
                        href="#search"
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </a>
                    </li>
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <div className="toggle-wrap">
                        <Button
                          className={`btn-icon btn-trigger toggle ${tablesm ? "active" : ""}`}
                          onClick={() => updateTableSm(true)}
                        >
                          <Icon name="menu-right"></Icon>
                        </Button>
                        <div className={`toggle-content ${tablesm ? "content-active" : ""}`}>
                          <ul className="btn-toolbar gx-1">
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle color="tranparent" className="btn btn-trigger btn-icon dropdown-toggle">
                                  <Icon name="setting"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right className="dropdown-menu-xs">
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
                                          sortFunc("dsc");
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
                                          sortFunc("asc");
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
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`card-search search-wrap ${!onSearch && "active"}`}>
                <div className="card-body">
                  <div className="search-content">
                    <Button
                      className="search-back btn-icon toggle-search active"
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by user or email"
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
            <DataTableBody>
              <DataTableHead>
                <DataTableRow>
                  <span className="sub-text">User</span>
                </DataTableRow>

                <DataTableRow className="nk-tb-col-tools text-right"></DataTableRow>
              </DataTableHead>
              {/*Head*/}
              {currentItems.length > 0
                ? currentItems.map((item, index) => {
                    return (
                      <DataTableItem key={`${item._id}_${index}`}>
                        <DataTableRow>
                          <Link to={`${process.env.PUBLIC_URL}/user-details/${item._id}`}>
                            <div className="user-card">
                              <UserAvatar
                                text={findUpper(
                                  item.firstName?.[0]?.toUpperCase() + " " + item?.lastName?.[0]?.toUpperCase()
                                )}
                              ></UserAvatar>
                              <div className="user-info">
                                <span className="tb-lead">{item.firstName + " " + item?.lastName} </span>
                                <span>{item.email}</span>
                              </div>
                            </div>
                          </Link>
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
                                    <li onClick={() => onEditClick(item)}>
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
                                          setDeleteId(item?._id);
                                          setDeleteModal(true);
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
                                          <span>Delete User</span>
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
                    );
                  })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {currentItems.length > 0 ? (
                <PaginationComponent
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
          </DataTable>
        </Block>
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
              <h5 className="title">Add User</h5>
              <div className="mt-4">
                <Form className="row gy-4" noValidate onSubmit={handleSubmit(onFormSubmit)}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">First Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="firstName"
                        defaultValue={formData.firstName}
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
                        defaultValue={formData.lastName}
                        placeholder="Enter last name"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.lastName && <span className="invalid">{errors.lastName.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Email </label>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        defaultValue={formData.email}
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
                          Add User
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
              <h5 className="title">Update User</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">First Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="firstName"
                        defaultValue={formData.firstName}
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
                        defaultValue={formData.lastName}
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
                        defaultValue={formData.email}
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
      </Content>
    </React.Fragment>
  );
};
export default UserList;
