let chartInstance;
async function visualizeData(type = "income") {
  let req = await fetch(
    `https://pp-qln0.onrender.com/api/v1/analytics?type=${type}`
  );
  let res = await req.json();
  console.log(res);
  let transactions = res.transactions.map((item) => ({
    category: item.category.name,
    ...item,
  }));

  const labels = transactions.map((transaction) => transaction.category.name);
  const data = transactions.map((transaction) => transaction.totalAmount);

  const ctx = document.getElementById("myChart");

  if (chartInstance) {
    chartInstance.destroy(); // Destroy the existing chart instance
  }
  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      // labels: labels, // Use dynamically generated labels from income transactions
      datasets: [
        {
          // label: labels,
          data: data, // Use dynamically generated data from income transactions
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
      responsive: true, // Make the chart responsive
      maintainAspectRatio: false, // Allow the chart to adjust its aspect ratio
      plugins: {
        legend: {
          position: "top", // Position the legend on top
          labels: {
            font: {
              size: 14, // Adjust font size for the legend labels
            },
          },
        },
      },
      animation: {
        duration: 500, // Duration of the animation
        easing: "linear", // Easing function for animation
      },
      scales: {
        x: {
          grid: {
            display: false, // Hide vertical grid lines
          },
          ticks: {
            maxRotation: 90, // Rotate labels by 90 degrees (vertical)
            minRotation: 90, // Ensure all labels are vertical
          },
        },
        y: {
          grid: {
            display: false, // Hide horizontal grid lines
          },
          ticks: {
            display: false, // Hide the Y-axis labels (amount values)
          },
        },
      },
      aspectRatio: 1, // Adjust aspect ratio for responsive resizing
    },
  });

  // DOM content interaction
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

  transactions.forEach((item) => {
    analysis(
      item.category.image,
      item.category.name,
      item.totalAmount,
      ((item.totalAmount / res.totalIncome) * 100).toFixed(2)
    );
  });
}

let dataAnalysContainer = document.querySelector(".data-container");
function analysis(src, name, amount, percentage) {
  let userCurrency = "";
  let template = `<li>
                  <div class="img-container">
                    <img src="${src}" alt="" />
                  </div>
                  <div class="text-amount-bar">
                    <div class="category-name-analysis">
                      <p class="little-bold">${name}</p>
                      <div class="money-value"><span class="currency-symbol">${userCurrency}</span> ${amount}</div>
                    </div>
                    <div class="analysis-bar-container">
                      <div class="analysis-bar" style="width:${percentage}%;"></div>
                    </div>
                  </div>
                  <div class="percentage little-bold">${percentage}%</div>
                </li>`;
  dataAnalysContainer.innerHTML += template;
}

let analysisBtn = document.querySelector(".chart-section");
analysisBtn.addEventListener("click", () => visualizeData("income"));

document
  .querySelector(".expense-view")
  .addEventListener("click", () => visualizeData("expense"));
