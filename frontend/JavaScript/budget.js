import { expenseCategories } from "../data/categories.js";
let parent = document.querySelector(".budget-list");
let budgetedCategories = [];
let userCurrency = JSON.parse(localStorage.getItem("currency"));
let clickedBudget = ""; //this for knowing user which category is clicked

let updatedArray = expenseCategories;
function baseTemplate(name, image, id) {
  let template = `<li>
                  <div class="left-portion">
                    <img
                      class="icon"
                      src="${image}"
                      alt=""
                    />
                    <p class="change-font-style">${name}</p>
                  </div>
                  <div class="right-portion">
                    <button class="set-budget-btn" data-category-id="${id}">SET BUDGET</button>
                  </div>
                </li>`;
  parent.innerHTML += template;
}

let cancelBudget = document.querySelector(".cancel-budget-box");
let cancelEdit = document.querySelector(".cancel-edit-box");
let budgetBox = document.querySelector(".budget-input-container");
let editBudgetBox = document.querySelector(".budget-edit-container");
let updatedLimitinput = document.getElementById("budget-updated-value");
let budgetContainer = document.querySelector(".budget-container");
let updateLimitBtn = document.querySelector(".updated-limit");
let setBudgetLimitBtn = document.querySelector(".set-limit");
let ulParent = document.querySelector(".set-budgeted-list");
function removeBudget(btn) {
  //reloadDots();
  console.log("1");
  let btnId = btn.parentElement.dataset.categoryId;
  removeBudgetDb(btnId, loadBudgeted);
  btn.parentElement.parentElement.parentElement.parentElement.remove();
}
cancelEdit.addEventListener("click", closeEditBox);

function closeEditBox() {
  editBudgetBox.classList.remove("active");
  budgetContainer.classList.remove("blurbg");
}

function reloadtwo() {
  let setBudgetBtns = document.querySelectorAll(".set-budget-btn");
  setBudgetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      clickedBudget = btn.parentElement.parentElement;
      let image =
        btn.parentElement.parentElement.children[0].children[0].getAttribute(
          "src"
        );
      let name =
        btn.parentElement.parentElement.children[0].children[1].textContent;
      let id = btn.dataset.categoryId;
      openBudgetBox(name, image, id);
    });
  });
}

function reload() {
  let setBudgetBtns = document.querySelectorAll(".set-budget-btn");
  let threeDots = document.querySelectorAll(".three-dot");
  let options = document.querySelectorAll(".budget-operations");
  let removeBtns = document.querySelectorAll(".remove-budget");
  let changeLimitBtn = document.querySelectorAll(".change-limit");

  removeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      reload();
      removeBudget(btn);
    });
  });

  threeDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (options[index].classList.contains("active")) {
        options[index].classList.remove("active");
      } else {
        options.forEach((opt) => opt.classList.remove("active"));

        options[index].classList.toggle("active");
      }
    });
  });

  setBudgetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      clickedBudget = btn.parentElement.parentElement;
      let image =
        btn.parentElement.parentElement.children[0].children[0].getAttribute(
          "src"
        );
      let name =
        btn.parentElement.parentElement.children[0].children[1].textContent;
      let id = btn.dataset.categoryId;
      openBudgetBox(name, image, id);
    });
  });

  changeLimitBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      options.forEach((opt) => opt.classList.remove("active"));
      openEditBox(btn);
    });
  });
}

function openEditBox(btn) {
  let parent = btn.parentElement.parentElement.parentElement;
  let id = btn.parentElement.dataset.categoryId;
  let image = parent.children[0].children[0].getAttribute("src");
  let text = parent.children[0].children[1].children[0].textContent;
  let budget =
    parent.parentElement.children[1].children[0].children[0].textContent;
  console.log(budget);

  let itemName = document.querySelector(".edit-category-name");
  let itemImage = document.querySelector(".edit-budget-icon");
  updatedLimitinput.value = Number(budget.split(" ")[1]);

  itemName.innerHTML = text;
  itemImage.setAttribute("src", image);
  editBudgetBox.classList.add("active");
  budgetContainer.classList.add("blurbg");

  updateLimitBtn.addEventListener("click", () => {
    closeEditBox();
    let updatedLimit = document.getElementById("budget-updated-value").value;
    console.log(updatedLimit);
    try {
      if (!isNaN(Number(updatedLimit))) {
        parent.parentElement.children[1].children[0].children[0].innerHTML =
          updatedLimit.trim();
        updateBudgetDb(id, { budget: updatedLimit });
      }
    } catch (err) {
      console.log(err.message);
    }

    // setBudgetTemplate();
  });
}

function openBudgetBox(category, src, id) {
  let name = document.querySelector(".budget-category-name");
  let image = document.querySelector(".set-budget-icon");
  setBudgetLimitBtn.dataset.categoryId = id;
  name.innerHTML = category;
  image.setAttribute("src", src);

  budgetBox.classList.add("active");
  budgetContainer.classList.add("blur");
}

function closeBudgetBox() {
  budgetBox.classList.remove("active");
  budgetContainer.classList.remove("blur");
}
cancelBudget.addEventListener("click", closeBudgetBox);

function setBudgetTemplate(id, name, image, budget, remaining, spend) {
  // ulParent.innerHTML = " ";
  let template = `<li>
                      <div class="text-container">
                        <div class="left-portion">
                          <img
                            class="icon"
                            src="${image}"
                            alt=""
                          />
                          <div class="budget-details">
                            <p class="change-font-style">${name}</p>
                            <div class="spent-box">
                              <p>Spent:</p>
                              <p class="amount-spent red"><span class="currency-symbol">${userCurrency}</span> ${spend}</p>
                            </div>
                            <div class="remaining-box">
                              <p>Remaining:</p>
                              <p class="amount-remaining green"><span class="currency-symbol">${userCurrency}</span> ${remaining}</p>
                            </div>
                          </div>
                        </div>
                        <div class="right-portion">
                          <img class="three-dot svg" src="icons/dot.svg" alt="" />
                          <small class="added-time opacity">(Aug,2004)</small>
                          <div class="budget-operations" data-category-id="${id}">
                            <p class="change-limit">Change limit</p>
                            <p class="remove-budget">Remove budget</p>
                        </div>
                        </div>
                      </div>
                      <div class="bar-container">
                        <div class="label-content">
                          <div class="label"><span class="currency-symbol">${userCurrency}</span> ${budget}</div>
                        </div>
                        <div class="bar-status ${
                          spend > budget ? "limit-exceed" : "limited"
                        }" style="width:${(spend / budget) * 100}%;"></div>
                      </div>
                    </li>`;
  ulParent.innerHTML += template;
}

setBudgetLimitBtn.addEventListener("click", () => {
  closeBudgetBox();
  let id = setBudgetLimitBtn.dataset.categoryId;
  let name = document.querySelector(".budget-category-name").textContent;
  let image = document.querySelector(".set-budget-icon").getAttribute("src");
  let budget = document.getElementById("budget-value").value.trim();

  // parent.innerHTML = "";

  document.getElementById("budget-value").value = " ";

  try {
    if (Number(budget) > 0) {
      let spend = chechHistory(id);
      let remaining = budget - spend;

      let data = { categoryId: id, budget, spend };

      createBudgetDb(data);
      setBudgetTemplate(id, name, image, budget, remaining, spend);
      // reload();
      clickedBudget.remove();
    }
  } catch (err) {
    console.log(err);
  }
});

document.addEventListener("click", (e) => {
  let setBudgetBtns = document.querySelectorAll(".set-budget-btn");
  let changeLimitBtn = document.querySelectorAll(".change-limit");
  let threeDots = document.querySelectorAll(".three-dot");
  let options = document.querySelectorAll(".budget-operations");
  let isBtnClick = true;
  let dots = true;
  let opt = true;
  threeDots.forEach((dot) => {
    if (dot.contains(e.target)) {
      dots = false;
    }
  });
  options.forEach((opt) => {
    if (opt.contains(e.target)) {
      opt = false;
    }
  });
  setBudgetBtns.forEach((btn) => {
    if (btn.contains(e.target)) {
      isBtnClick = false;
    }
  });
  if (!budgetBox.contains(e.target) && isBtnClick) {
    closeBudgetBox();
  }

  changeLimitBtn.forEach((dot) => {
    if (dot.contains(e.target)) {
      isBtnClick = false;
    }
  });
  if (!editBudgetBox.contains(e.target) && isBtnClick) {
    closeEditBox();
  }
  if (dots && opt) {
    options.forEach((option) => option.classList.remove("active"));
  }
});

//-------------READ BUDGETS -----------------------
async function loadDataBudgets(month) {
  let req = await fetch(
    `https://pp-qln0.onrender.com/api/v1/users/budgets?month=${month}`
  );
  let res = await req.json();
  console.log(res);
  if (res.status == "success") {
    let { data } = res;

    ulParent.innerHTML = " ";
    document.querySelector(".budget-list").innerHTML = "";

    let unBudgeted = data[0].unBudgeted;
    let budgeted = data[0].budgeted;

    budgeted.forEach((data) => {
      let { budget, _id, remaining, spend } = data;
      let { image, name } = data.categoryId;
      setBudgetTemplate(_id, name, image, budget, remaining, spend);
    });
    unBudgeted.forEach((item) => {
      baseTemplate(item.name, item.image, item._id);
    });

    reload();
  }
}

//--------------------CREATE BUDGETS---------------------
async function createBudgetDb(data) {
  const date = new Date();
  const formattedMonth = date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  data.month = formattedMonth;
  try {
    let req = await fetch(`https://pp-qln0.onrender.com/api/v1/users/budgets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    let res = await req.json();
    console.log(res);

    document.querySelector(
      ".set-budgeted-list"
    ).lastElementChild.children[0].lastElementChild.lastElementChild.dataset.categoryId =
      res.data._id;
  } catch (e) {
    console.log(e);
  }
}

//--------------------REMOVE BUDGETS---------------------
async function removeBudgetDb(budgetId, callBack) {
  console.log("cllad");
  let req = await fetch(
    `https://pp-qln0.onrender.com/api/v1/users/budgets/${budgetId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );
  callBack();
}

//--------------------UPDATE BUDGETS---------------------
async function updateBudgetDb(budgetId, data) {
  let req = await fetch(
    `https://pp-qln0.onrender.com/api/v1/users/budgets/${budgetId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  let res = await req.json();
  console.log(res);
}

async function loadBudgeted() {
  let req = await fetch(`https://pp-qln0.onrender.com/api/v1/users/budgets`);
  let res = await req.json();
  if (res.status == "success") {
    let { data } = res;

    let unBudgeted = data[0].unBudgeted;
    parent.innerHTML = "";
    unBudgeted.forEach((item) => {
      baseTemplate(item.name, item.image, item._id);
    });
  }
  
  reloadtwo();
}

function reloadDots() {
  let threeDots = document.querySelectorAll(".three-dot");
  let options = document.querySelectorAll(".budget-operations");
  let removeBtns = document.querySelectorAll(".remove-budget");
  let changeLimitBtn = document.querySelectorAll(".change-limit");

  removeBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      reload();
      removeBudget(btn);
      // Prevent the event from bubbling up
    });
  });

  threeDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (options[index].classList.contains("active")) {
        options[index].classList.remove("active");
      } else {
        options.forEach((opt) => opt.classList.remove("active"));

        options[index].classList.toggle("active");
      }
    });
  });
  changeLimitBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      options.forEach((opt) => opt.classList.remove("active"));
      openEditBox(btn);
    });
  });
}

function chechHistory(id) {
  let history = JSON.parse(localStorage.getItem("Trasnactions")) || [];

  let spendedAmount = history.reduce((acc, item) => {
    if (item.category._id == id) {
      acc += item.amount;
    }
    return acc;
  }, 0);
  return spendedAmount > 0 ? spendedAmount : 0;
}

document.querySelector(".skeleton-budget").addEventListener("click", () => {
  loadDataBudgets("November%202024");
});
