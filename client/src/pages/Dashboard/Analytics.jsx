import React, { useEffect, useState } from "react";
import Header from "../../components/shared/Layout/Header";
import { toast } from "react-toastify";
import API from "../../services/API";
import Barchart from "../../dummy/Barchart";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { IoArrowBack } from "react-icons/io5";

// Register the CategoryScale
Chart.register(CategoryScale);

const Analytics = () => {
  const [data, setData] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null); // To track the selected card

  const getBloodGroupData = async () => {
    try {
      const { data } = await API.get("/analytics/bloodGroups-data");
      if (data?.success) {
        setData(data?.bloodGroupData);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getBloodGroupData();
  }, []);

  const handleCardClick = (index) => {
    setSelectedCardIndex(index); // Set the clicked card's index
  };

  const handleBackClick = () => {
    setSelectedCardIndex(null); // Reset the selection to show all cards again
  };

  const colors = [
    "#FFE5AD",
    "#FFA1F5",
    "#40DFEF",
    "#B4FF9F",
    "#F5F5F5",
    "#E8FFCE",
    "#F6FA70",
    "#F1F4DF",
  ];

  return (
    <div>
      <Header />
      <div className="d-flex flex-row flex-wrap analytics-container">
        {data?.map((record, i) => {
          const chartData = {
            labels: ["Total In", "Total Out", "Available"],
            datasets: [
              {
                data: [record.totalIn, record.totalOut, record.availableBlood],
                backgroundColor: ["#b30000", "#ecf0f1", "#50AF95"],
                borderColor: "black",
                borderWidth: 0.8,
              },
            ],
          };

          if (selectedCardIndex === i) {
            return (
              <div
                key={i}
                className="analytics-card card m-2 p-1"
                style={{ width: "19rem" }}
              >
                <button
                  onClick={handleBackClick}
                  className="btn btn-secondary btn-sm"
                >
                  <IoArrowBack />
                </button>
                <Barchart chartData={chartData} title={record.bloodGroup} />
              </div>
            );
          }

          // Show cards initially
          return (
            <div
              key={i}
              className="analytics-card card m-2 p-1"
              style={{
                width: "19rem",
                backgroundColor: colors[i],
              }}
              onClick={() => handleCardClick(i)} // Handle click to show the graph
            >
              <div className="card-body">
                <h1 className="card-title bg-light text-dark text-center mb-3">
                  {record.bloodGroup}
                </h1>
                <p className="card-text">
                  Total In: <b>{record.totalIn}</b> (ml)
                </p>
                <p className="card-text">
                  Total Out: <b>{record.totalOut}</b> (ml)
                </p>
              </div>
              <div className="card-footer text-light bg-dark text-center">
                Total Available: <b>{record.availableBlood}</b> (ml)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Analytics;
