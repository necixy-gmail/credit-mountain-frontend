import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner } from "reactstrap";
import { getAllTransaction } from "../../api/api";
import { BlockBetween, BlockHead, BlockHeadContent, BlockTitle } from "../../components/Component";
import Content from "../../layout/content/Content";
import Transaction from "../transaction/Transaction";

const Payments = () => {
  const TOKEN = useSelector((state) => state?.reducer?.token);
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchTransactions();
  }, []);
  const fetchTransactions = async () => {
    setLoading(true);
    getAllTransaction({ token: TOKEN })
      .then((res) => {
        setTransactionData(res.data?.data?.payments);
      })
      .catch((err) => {
        console.log("error all transaction", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (transactionData?.length == 0 && loading) {
    return (
      <React.Fragment>
        <Content>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle page>Transaction History</BlockTitle>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
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
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Transaction History</BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {/* {transactionData?.length > 0 ? ( */}
        <Transaction
          transactionData={[...transactionData]}
          setTransactionData={setTransactionData}
          fetchdata={() => fetchTransactions()}
        />
        {/* ) : null} */}
      </Content>
    </React.Fragment>
  );
};

export default Payments;
