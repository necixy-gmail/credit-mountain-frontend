import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  Spinner,
  Button,
  Modal,
  ModalBody,
  Form,
  FormGroup,
  Col,
} from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList, LinkItem } from "../../../../components/links/Links";
import UserAvatar from "../../../../components/user/UserAvatar";
import { useAuth0 } from "@auth0/auth0-react";
import { logout_app } from "../../../../redux/Reducer";
import { useHistory } from "react-router";
import { changePasswordApi, logout } from "../../../../api/api";
import { useForm } from "react-hook-form";
import { errorToast, successToast } from "../../../../utils/toast";
import { Link } from "react-router-dom";

const User = () => {
  const USER = useSelector((state) => state?.reducer?.user);
  const TOKEN = useSelector((state) => state?.reducer?.token);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [changeLoading, setchangeLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const handleSignout = () => {
    setloading(true);
    logout(TOKEN)
      .then((res) => {
        dispatch({ type: "LOGOUT" });
        history?.push("login");
      })
      .catch((err) => {
        console.log("error Logout", err);
      })
      .finally(() => {
        setloading(false);
      });
  };
  const resetForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
    });
  };
  const onFormCancel = () => {
    setModalVisible(false);
    resetForm();
  };
  const onFormSubmit = async (submitdata) => {
    const { currentPassword, newPassword } = submitdata;
    setchangeLoading(true);
    changePasswordApi({
      token: TOKEN,
      data: {
        newPassword: newPassword,
        currentPassword: currentPassword,
      },
    })
      .then((res) => {
        successToast("Password changed successfully.");
        onFormCancel();
      })
      .catch((err) => {
        if (err?.response?.data) {
          errorToast(err?.response?.data?.message);
        }
      })
      .finally(() => {
        setchangeLoading(false);
      });
  };
  const { errors, register, handleSubmit } = useForm();

  return (
    <>
      <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
        <DropdownToggle
          tag="a"
          href="#toggle"
          className="dropdown-toggle"
          onClick={(ev) => {
            ev.preventDefault();
          }}
        >
          <UserAvatar icon="user-alt" className="sm" />
        </DropdownToggle>
        <DropdownMenu right className="dropdown-menu-md dropdown-menu-s1">
          <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
            <div className="user-card sm">
              <div className="user-avatar">
                <Icon name={"user"} />
              </div>
              <div className="user-info">
                <span className="lead-text">{`${USER?.firstName} ${USER?.lastName}`}</span>
                <span className="sub-text">{USER?.email}</span>
              </div>
            </div>
          </div>
          <div className="dropdown-inner">
            <Button
              color="primary"
              outline
              style={{ marginTop: 5, marginBottom: 5 }}
              onClick={() => {
                setModalVisible(true);
              }}
            >
              Change Password
            </Button>
          </div>
          <div className="dropdown-inner">
            <LinkList>
              <a onClick={handleSignout}>
                <Icon name="signout"></Icon>
                <span>Sign Out</span>
                {loading && <Spinner style={{ height: 17, width: 17, marginInlineStart: 7 }} />}
              </a>
            </LinkList>
          </div>
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={modalVisible} toggle={() => setModalVisible(false)} className="modal-dialog-centered" size="lg">
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
            <h5 className="title">Change Password</h5>
            <div className="mt-4">
              <Form className="row gy-4" noValidate onSubmit={handleSubmit(onFormSubmit)}>
                <Col md="6">
                  <FormGroup>
                    <label className="form-label">Current Password</label>
                    <input
                      className="form-control"
                      type="text"
                      name="currentPassword"
                      defaultValue={formData.currentPassword}
                      placeholder="Enter current password"
                      ref={register({ required: "This field is required" })}
                    />
                    {errors.currentPassword && <span className="invalid">{errors.currentPassword.message}</span>}
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label className="form-label">New Password</label>
                    <input
                      className="form-control"
                      type="text"
                      name="newPassword"
                      defaultValue={formData.newPassword}
                      placeholder="Enter new password"
                      ref={register({ required: "This field is required" })}
                    />
                    {errors.newPassword && <span className="invalid">{errors.newPassword.message}</span>}
                  </FormGroup>
                </Col>

                <Col size="12">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    <li>
                      <Button color="primary" size="md" type="submit">
                        Change Password
                        {changeLoading && <Spinner style={{ height: 15, width: 15 }} />}
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
    </>
  );
};

export default User;
