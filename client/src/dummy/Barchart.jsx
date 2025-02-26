import React from "react";
import { Bar } from "react-chartjs-2";
const Barchart = ({ chartData, title }) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: false,
            },
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              barPercentage: 0.3, // Adjusts the width of the bars
              categoryPercentage: 0.8, // Adjusts spacing between bars
            },
          },
        }}
      />
    </div>
  );
};

export default Barchart;
