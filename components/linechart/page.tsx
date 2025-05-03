"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: { x: string; y: number }[]; // x = date (string), y = total (number)
}

const LineChart = ({ data }: LineChartProps) => {
  // Chart data structure
  const chartData = {
    labels: data.map((item) => item.x), // Dates (x-axis labels)
    datasets: [
      {
        label: "Total Orders",
        data: data.map((item) => item.y), // Total values (y-axis data)
        fill: false,
        borderColor: "#68d619", // Line color
        tension: 0.1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `Total: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          autoSkip: true,
          maxRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Orders",
        },
        ticks: {
          beginAtZero: true,
          callback: (value: any) => value.toLocaleString(), // Format y-axis labels with commas
        },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={chartOptions}/>
    </div>
  );
};

export default LineChart;
