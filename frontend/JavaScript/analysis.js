import { transactionHistory } from "../data/homedata.js";

const ctx = document.getElementById("myChart");
// let daa = [];
// transactionHistory.forEach((item) => {
//   let { transactions } = item;
//   daa.push(
//     transactions.filter((cat) => {
//       if (cat.category.type == "income") {
//         return cat;
//       }
//     })
//   );
// });


new Chart(ctx, {
  type: "bar",
  data: {
    
    labels: ["Salary", "Rent", "Awards", "Grants", "Sale", "Lottery"], // X-axis labels
    datasets: [
      {
        label: "Number of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 1)", // Red
          "rgba(54, 162, 235, 1)", // Blue
          "rgba(255, 206, 86, 1)", // Yellow
          "rgba(75, 192, 192, 1)", // Green
          "rgba(153, 102, 255, 1)", // Purple
          "rgba(255, 159, 64, 1)", // Orange
        ],
        hoverOffset: 10,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true, // Show X axis
        grid: {
          display: false, // Hide vertical grid lines
        },
        ticks: {
          color: [
            "rgba(255, 99, 132, 1)", // Red
            "rgba(54, 162, 235, 1)", // Blue
            "rgba(255, 206, 86, 1)", // Yellow
            "rgba(75, 192, 192, 1)", // Green
            "rgba(153, 102, 255, 1)", // Purple
            "rgba(255, 159, 64, 1)", // Orange
          ],
        },
      },
      y: {
        display: false, // Hide Y axis
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
    animation: false, // Disable animation
  },
});

//dom content
let optionBody = document.querySelector(".opt-body");
let options = document.querySelector(".category-options");
optionBody.addEventListener("click", () => {
  options.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!optionBody.contains(e.target) && !options.contains(e.target)) {
    options.classList.remove("active");
  }
});
