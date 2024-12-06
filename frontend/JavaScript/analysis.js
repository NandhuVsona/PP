let chartInstance;
const currentDate = new Date();
const options = { year: "numeric", month: "long" };
const formattedDate = currentDate.toLocaleDateString("en-US", options);

let dataAnalysContainer = document.querySelector(".data-container");
export default async function visualizeData(
  type = "income",
  month = formattedDate
) {
  let req = await fetch(
    `https://pp-qln0.onrender.com/api/v1/analytics?type=${type}&month=${month}`
  );
  let res = await req.json();
  let chart = document.querySelector(".chart");
  if (res.totalIncome == 0) {
    dataAnalysContainer.innerHTML = "";

    chart.innerHTML = `<div class="no-content-container" style="margin-bottom: 150px";>
    <img src="images/404.png" alt="" />
    <p>
      No record in this month. Tap + to add new expense or income.
    </p>
  </div>`;
    return;
  } else {
    chart.innerHTML = '<canvas width="400" height="400" id="myChart"></canvas>';
  }

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
    type: res.chart || "doughnut",
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
      maintainAspectRatio: true, // Allow the chart to adjust its aspect ratio
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
    options.classList.add("active");
  });

  document.addEventListener("click", (e) => {
    if (!optionBody.contains(e.target) && !options.contains(e.target)) {
      options.classList.remove("active");
    }
  });

  dataAnalysContainer.innerHTML = "";

  transactions.forEach((item) => {
    analysis(
      item.category.image,
      item.category.name,
      item.totalAmount.toLocaleString(),
      ((item.totalAmount / res.totalIncome) * 100).toFixed(2)
    );
  });
}

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
analysisBtn.addEventListener("click", () => {
  let month = document.querySelectorAll(".month-body .month")[1].textContent;
  let type = document
    .querySelector(".current-view")
    .textContent.toLowerCase()
    .trim()
    .split(" ")[0];
  visualizeData(type, month);
});

document.querySelector(".expense-view").addEventListener("click", () => {
  let month = document.querySelectorAll(".month-body .month")[1].textContent;
  visualizeData("expense", month);
});
document.querySelector(".income-view").addEventListener("click", () => {
  let month = document.querySelectorAll(".month-body .month")[1].textContent;
  visualizeData("income", month);
});
