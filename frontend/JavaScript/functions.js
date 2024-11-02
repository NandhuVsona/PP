import { closeEditBox, closeAccountBox } from "./script.js";
let  userCurrency = JSON.parse(localStorage.getItem("currency"))


const globalId = "66efd1552e03ec45ce74d5fd";
let accountsList = document.querySelectorAll(".account-list li");
let editBtns = document.querySelectorAll(".edit-btn");

let options = document.querySelectorAll(".operations .options");
let accountPage = document.querySelector(".account");

//Global variables
let selectedCard = "";
let accountImg = "";
export function reloadFunctionality() {
  let dots = document.querySelectorAll(".operations .dot");
  let options = document.querySelectorAll(".operations .options");
  let editBtns = document.querySelectorAll(".edit-btn");
  let accountsList = document.querySelectorAll(".account-list li");
  let accountDelBtn = document.querySelectorAll(".delete-account");
  let addAccountBtn = document.querySelector(".add-box");
  let accountBox = document.querySelector(".box-body");
  let accountPage = document.querySelector(".account");

  addAccountBtn.addEventListener("click", () => {
    closeEditBox();
    accountBox.classList.add("active");
    accountPage.classList.add("blurbg");
  });

  //delete account
  accountDelBtn.forEach((account) => {
    account.addEventListener("click", () => {
      account.parentElement.parentElement.parentElement.remove();
      console.log(account.parentElement.dataset.accountId);
      deleteAccountDb(account.parentElement.dataset.accountId);
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (options[index].classList.contains("active")) {
        options[index].classList.remove("active");
      } else {
        // Deactivate all options
        options.forEach((option) => option.classList.remove("active"));
        // Activate the clicked option
        options[index].classList.add("active");
      }
    });
  });

  //edit account
  editBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const accountName =
        btn.parentElement.parentElement.parentElement.children[0].children[1]
          .children[0].textContent;

      const amount =
        btn.parentElement.parentElement.parentElement.children[0].children[1].children[1].children[0].textContent.trim().split(" ")[1]
        console.log(amount)
      options[index].classList.remove("active");
      selectedCard = btn.parentElement.parentElement.parentElement;

      accountsList.forEach((account) => {
        if (
          account.children[0].getAttribute("src") ==
          selectedCard.children[0].children[0].getAttribute("src")
        ) {
          accountImg = account.children[0].getAttribute("src");
          account.classList.add("active");
        } else {
          account.classList.remove("active");
        }
      });
      openEditPanael(accountName, amount);
    });
  });
}

//Save functionality------------------------------------------------------
export function saveAccount() {
  closeAccountBox();
  let initialAmount =
    document.getElementById("initial-amount").value.trim() || 0;
  let balance = initialAmount;
  let accountName = document.getElementById("account-name").value.trim();
  if (isNaN(initialAmount)) {
    initialAmount = 0;
  }
  if (accountName === "" || accountName.lenght < 0) {
    return;
  }
  let icon = "";
  accountsList.forEach((account) => {
    if (account.classList.contains("active")) {
      icon = account.children[0].getAttribute("src");
    }
  });
  let existingAccounts = document.querySelector(".accounts");
  let template = `<li class="card">
                <div class="card-body">
                  <img class='icon' src="${icon}" alt="" />
                  <div class="card-info">
                    <p class="bold">${accountName}</p>
                    <p>Balance: <span class="green bold"><span class="currency-symbol">${JSON.parse(localStorage.getItem("currency"))}</span> ${
                      balance == 0 ? "0" : balance.toLocaleString("en-IN")
                    }</span></p>
                  </div>
                </div>
                <div class="operations">
                  <img class="dot svg" src="icons/dot.svg" alt="" />
                  <div class="options">
                    <p class="edit-btn">Edit</p>
                    <p class="delete-account">Delete</p>
                  </div>
                </div>
              </li>`;
  existingAccounts.innerHTML += template;
  document.getElementById("initial-amount").value = "";
  document.getElementById("account-name").value = "";
  reloadFunctionality();
  let userId = "66eda54993eb73490edfa62d";
  let data = {
    accountName,
    balance,
    icon,
    userId,
  };

  saveAccountDb(data, globalId);
}

//update functionality---------------------------------------------

export function updateAccount() {
  let currency = JSON.parse(localStorage.getItem("currency"))
  accountPage.classList.remove("blur");
  closeEditBox();
  let updatedAmount = document.getElementById("edit-amount").value.trim();
  let updatedAccountName = document
    .getElementById("edit-account-name")
    .value.trim();

  let imageSrc = "";
  accountsList.forEach((account) => {
    if (account.classList.contains("active")) {
      imageSrc = account.children[0].getAttribute("src");
    }
  });

  selectedCard.children[0].children[0].setAttribute("src", imageSrc);
  if (isNaN(updatedAmount) || updatedAccountName.length === 0) return;

  let formatedAmount = Number(updatedAmount);
  selectedCard.children[0].children[1].children[0].innerHTML =
    updatedAccountName;

  selectedCard.children[0].children[1].children[1].children[0].innerHTML =
    formatedAmount == 0 ? `<span class='currency-symbol'>${currency}</span> 0` : `<span class='currency-symbol'>${currency}</span> ` + formatedAmount.toLocaleString("en-IN");

  const accountId =
    selectedCard.lastElementChild.lastElementChild.dataset.accountId;
  let updatedData = {
    icon: imageSrc,
    accountName: updatedAccountName,
    balance: updatedAmount,
  };

  updateAccountDb(updatedData, accountId);
}

//edit account functainolity
editBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    console.log("hello")
    const accountName =
      btn.parentElement.parentElement.parentElement.children[0].children[1]
        .children[0].textContent;

    const amount =
      btn.parentElement.parentElement.parentElement.children[0].children[1].children[1].children[0].textContent.slice(
        1
      );
      console.log(amount)
    options[index].classList.remove("active");
    selectedCard = btn.parentElement.parentElement.parentElement;

    accountsList.forEach((account) => {
      if (
        account.children[0].getAttribute("src") ==
        selectedCard.children[0].children[0].getAttribute("src")
      ) {
        accountImg = account.children[0].getAttribute("src");
        account.classList.add("active");
      } else {
        account.classList.remove("active");
      }
    });
    openEditPanael(accountName, amount);
  });
});

function openEditPanael(account, amount) {
  document.querySelector(".account-container").classList.add("blur");

  let acutalAmount = amount.split(",").join("");
  let editAmount = document.getElementById("edit-amount");
  let editAccountName = document.getElementById("edit-account-name");
  editAmount.value = acutalAmount;
  editAccountName.value = account;
  document.querySelector(".edit-box-body").classList.add("active");
  editAmount.focus();
}

//-------DATABASE OPERATIONS ----------------------------------

// 1) SAVE FUNCTIONALITY
async function saveAccountDb(data, userId) {
  let req = await fetch(`http://localhost:4000/api/v1/users/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  let res = await req.json();
  console.log(res);
  if (res.status === "success") {
    document.querySelector(
      ".accounts"
    ).lastElementChild.lastElementChild.lastElementChild.dataset.accountId =
      res.data._id;
  }
}

// 2) UPDATE FUCTIONALITY

async function updateAccountDb(data, accountId) {
  let req = await fetch(
    `http://localhost:4000/api/v1/users/accounts/${accountId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  let res = await req.json();
  console.log(res);
}

// 3) DELETE FUCTIONALITY

async function deleteAccountDb(accountId) {
  let req = await fetch(
    `http://localhost:4000/api/v1/users/accounts/${accountId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );
  console.log("Successfully Deleted");
}



//
