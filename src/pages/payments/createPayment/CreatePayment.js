import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Button, Col, Modal, ModalBody, Spinner } from "reactstrap";
import { cargeUserApi } from "../../../api/api";
import { Block, BlockHead, BlockHeadContent, BlockTitle, Icon } from "../../../components/Component";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { errorToast, successToast } from "../../../utils/toast";
const CreatePayment = ({}) => {
  const TOKEN = useSelector((state) => state?.reducer?.token);

  const userData = useSelector((state) => state?.reducer?.userListData);
  const [userSelectModal, setUserSelectModal] = useState(false);
  const [gateway, setGateway] = useState("Braintree");
  const [selectedUser, setSelectedUser] = useState();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState();
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const validate = () => {
    let userError = "";
    let amountError = "";
    let descError = "";
    if (!selectedUser?._id) {
      userError = "Please select a user first.";
    }

    if (!amount) {
      amountError = "Please enter amount.";
    }

    if (!desc) {
      descError = "Please enter description.";
    }

    if (userError?.length || amountError?.length || descError?.length) {
      setError({
        user: userError,
        amount: amountError,
        desc: descError,
      });
      return false;
    } else {
      setError({});
      return true;
    }
  };
  const handleCharge = async () => {
    const valid = validate();
    if (valid) {
      setloading(true);
      chargeUser({
        gateway: gateway,
        amount: Number(amount),
        extra: {
          description: desc,
        },
      });
    }
  };

  const history = useHistory();
  const chargeUser = async (data) => {
    cargeUserApi({ token: TOKEN, userId: selectedUser?._id, data: data })
      .then((res) => {
        console.log("ress cahrge ", res.data);
        successToast("Success");
        history?.push("/payments");
      })
      .catch((err) => {
        console.log(("error", err));
        if (err?.response?.data) {
          errorToast(err?.response?.data?.message);
        }
      })
      .finally(() => {
        setloading(false);
      });
  };

  return (
    <React.Fragment>
      <Head title={"Credit Mountain"} />
      <Content>
        <BlockHead size="xl">
          <div className="nk-block-between">
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Create Payment
              </BlockTitle>
            </BlockHeadContent>
          </div>
        </BlockHead>
        <Block>
          <Col md="12">
            <label className="form-label">User</label>
            <div className="form-control" onClick={() => setUserSelectModal(true)}>
              <label className="form-placeholder">
                {selectedUser?._id ? selectedUser?.firstName + " " + selectedUser?.lastName : "Select User"}
              </label>
            </div>
            {error?.user && <span className="invalid">{error?.user}</span>}
          </Col>
          <Col style={{ marginTop: 10 }} md="12">
            <label className="form-label">Amount</label>
            <input
              className="form-control"
              type="number"
              name="amount"
              defaultValue={""}
              placeholder="Enter Amount"
              onChange={(e) => setAmount(e?.target?.value)}
            />
            {error?.amount && <span className="invalid">{error?.amount}</span>}
          </Col>
          <Col style={{ marginTop: 10 }} md="12">
            <label className="form-label">Description</label>
            <input
              className="form-control"
              type="text"
              name="desc"
              defaultValue={""}
              placeholder="Enter description"
              onChange={(e) => setDesc(e?.target?.value)}
            />
            {error?.desc && <span className="invalid">{error?.desc}</span>}
          </Col>
          <Col size="12" style={{ marginTop: 10 }}>
            <label className="form-label">Select Gateway</label>
            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
              <li>
                <Button
                  outline
                  color={gateway === "Braintree" ? "success" : "secondary"}
                  size="md"
                  onClick={() => {
                    setGateway("Braintree");
                  }}
                >
                  Braintree
                </Button>
              </li>
              <li>
                <Button
                  outline
                  color={gateway === "Stripe" ? "success" : "secondary"}
                  size="md"
                  onClick={() => {
                    setGateway("Stripe");
                  }}
                >
                  Stripe
                </Button>
              </li>
            </ul>
          </Col>
          <Col size="12">
            <Button
              color={"primary"}
              size="lg"
              onClick={() => handleCharge()}
              style={{
                width: "100%",
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              Pay {loading && <Spinner style={{ height: 15, width: 15 }} />}
            </Button>
          </Col>
        </Block>
      </Content>
      <Modal
        isOpen={userSelectModal}
        toggle={() => setUserSelectModal(false)}
        className="modal-dialog-centered"
        size="lg"
      >
        <ModalBody>
          <a
            href="#cancel"
            onClick={(ev) => {
              ev.preventDefault();
              setUserSelectModal(false);
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="p-2">
            <h4 className="title">Select User</h4>
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {userData?.map((item) => (
                <div
                  key={item?._id}
                  className="mt-4"
                  onClick={() => {
                    setSelectedUser({ ...item });
                    setUserSelectModal(false);
                  }}
                >
                  <div className="custom-control custom-control-md custom-checkbox notext">
                    <input
                      type="checkbox"
                      className="custom-control-input form-control"
                      checked={selectedUser?._id === item?._id}
                      onChange={() => {}}
                    />
                    <label className="custom-control-label" htmlFor={"uid1"}>
                      {item?.firstName + " " + item?.lastName}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default CreatePayment;
