import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import API from "../services/API";
import { toast } from "react-toastify";
import Layout from "../components/shared/Layout/Layout";
import moment from "moment";

const Donations = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  const getDonars = useCallback(async () => {
    try {
      const { data } = await API.post("/inventory/get-inventory-hospital", {
        filters: {
          inventoryType: "in",
          donar: user?._id,
        },
      });
      if (data?.success) {
        setData(data?.inventory);
        console.log(data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [user?._id]);

  useEffect(() => {
    getDonars();
  }, [getDonars]);

  return (
    <Layout>
      <h3 className="mx-auto donar-heading">
        Donation Details{" "}
        <i
          className="fa-solid fa-hand-holding-medical fa-flip-horizontal"
          style={{ color: "#000000s" }}
        />
      </h3>
      <div className="container">
        <div className="container donar-data">
          <table className="table table-hover">
            <thead>
              <tr className="heading-fixed">
                <th scope="col">Blood Group</th>
                <th scope="col">Inventory Type</th>
                <th scope="col">Quantity</th>
                <th scope="col">Email</th>
                <th scope="col">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((record) => (
                <tr key={record._id}>
                  <td>{record.bloodGroup}</td>
                  <td>{record.inventoryType}</td>
                  <td>{record.quantity + "ml"}</td>
                  <td>{record.email}</td>
                  <td>
                    {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Donations;
