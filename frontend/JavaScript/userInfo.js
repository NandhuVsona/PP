let username = document.getElementById("username");
let currentProfile = document.querySelector(
  ".current-profile-conteiner .imgs img"
);
let homeDisplay = document.querySelector(".home-display-username");
let uNameDisplay = document.querySelector(".username-display");
let closeCurrency = document.querySelector(".close-currency");
let selectedCurrency;

async function profileSetup() {
  let req = await fetch("http://localhost:4000/api/v1/users");
  let res = await req.json();
  if (res.status == "success") {
    let { data } = res;
    // console.log(res);

    homeDisplay.textContent = data.username;
    uNameDisplay.textContent = data.username;
    username.value = data.username;

    currentProfile.setAttribute("src", "images/profiles/" + data.profile);
    document
      .querySelector(".user-profile")
      .setAttribute("src", "images/profiles/" + data.profile);
    changeCurrency(data.currency);
  }
}
profileSetup();

function filterObj(obj) {
  let allowedFields = ["username", "profile", "currency"];
  let sturcturedData = {};
  Object.keys(obj).forEach((field) => {
    if (allowedFields.includes(field)) {
      sturcturedData[field] = obj[field];
    }
  });
  return sturcturedData;
}
async function updateMe(obj) {
  let data = filterObj(obj);
  let req = await fetch(`http://localhost:4000/api/v1/users/updateMe`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  // let res = await req.json();
  // console.log(res);
}

let profileList = document.querySelectorAll(
  ".profile-options .profile-list li"
);

let userName = document.querySelector(".username-display");

profileList.forEach((profile) => {
  profile.addEventListener("click", () => {
    currentProfile.setAttribute("src", profile.children[0].getAttribute("src"));
  });
});

let inBox = document.getElementById("username");

inBox.addEventListener("input", (e) => {
  userName.textContent = e.target.value;
});

let updateProfileBtn = document.querySelector(".update-profile");
updateProfileBtn.addEventListener("click", () => {
  document.querySelector(".edit-box").classList.remove("active");
  if (username.value.trim().length == 0) {
    return;
  }

  document
    .querySelector(".user-profile")
    .setAttribute("src", currentProfile.getAttribute("src"));
  homeDisplay.textContent = username.value.trim();
  updateMe({
    username: username.value.trim(),
    profile: currentProfile.getAttribute("src").split("/")[2],
  });
});

let cancelBtn = document.querySelector(".aBtns .cancel-btn");
cancelBtn.addEventListener("click", () => {
  document.querySelector(".edit-box").classList.remove("active");
  username.value = document.querySelector(".home-display-username").textContent;
  uNameDisplay.textContent = document.querySelector(
    ".home-display-username"
  ).textContent;
  currentProfile.setAttribute(
    "src",
    document.querySelector(".user-profile").getAttribute("src")
  );
});

// CURRENCY OPTIONS
setTimeout(() => {
  let currencyOptions = document.querySelectorAll(".currency-options li");

  currencyOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      console.log(opt.dataset.currencyId);
      selectedCurrency = opt.dataset.currencyId;
      changeCurrency(opt.dataset.currencyId);
    });
  });
}, 1000);

function changeCurrency($) {
  document
    .querySelectorAll(".currency-symbol")
    .forEach((itme) => (itme.textContent = $));
}

closeCurrency.addEventListener("click", () => {
  if (selectedCurrency) {
    updateMe({ currency: selectedCurrency });
  }
});
