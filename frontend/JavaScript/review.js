import { fakeReviews } from "../data/reviews.js";
let reviewData = fakeReviews;

let wordCount = document.querySelector(".word-count");
let reviewInput = document.getElementById("calculate-word-len");

reviewInput.addEventListener("input", () => {
  wordCount.innerHTML = `${reviewInput.value.length}/500`;
});

let userFeedBack = document.querySelector(".user-feedback");
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function handleReviewStar(num) {
  let star = ``;
  for (let i = 0; i < 5; i++) {
    if (i < num) {
      star += '<img src="icons/filledstar.svg" alt="" />';
    } else {
      star += '<img class="star-shadow" src="icons/star.svg" alt="" />';
    }
  }
  return star;
}
loadReviews();
async function loadReviews() {
  let req = await fetch(
    "http://127.0.0.1:5500/frontend/JavaScript/reviews.json"
  );
  let res = await req.json();
  console.log(res);
  if (true) {
    // let { stats, reviews } = res;
    document.querySelector(".user-feedback").innerHTML = "";
    // document.querySelector(".rating-num-left h1").innerHTML = stats.avgRating;
    // document.querySelector(".nRating").innerHTML = stats.nRating;
    res.forEach((data) => {
      let template = ` <li class="review-card">
        <div class="review-card-head">
          <div class="review-left-part">
            <div style="background-color:${getRandomColor()}" class="img review-profile">${data.user
        .charAt(0)
        .toLocaleUpperCase()}</div>
            <p>${data.user}</p>
          </div>
          <div class="review-operations">
           
                    <img class="dot svg rr-dots" src="icons/dot.svg" alt="" />
                    <div class="options rr-options" data-account-id=>
                      <p class="edit-btn-rr">Edit</p>
                      <p class="delete-review">Delete</p>
                    </div>
                </div>  
        </div>
        <div class="review-card-center">
          <div class="reviewed-star">
            ${handleReviewStar(data.rating)}
          </div>
          <small class="review-date">${data.createdAt.slice(0, 10)}</small>
        </div>
        <p class="review-text">
          ${data.review}
        </p>
      </li>`;
      userFeedBack.innerHTML += template;
    });
  }
  document.querySelectorAll(".rr-dots")[0].addEventListener("click", () => {
    document.querySelectorAll(".rr-options")[0].classList.toggle("active");
  });
  let delBtn = document.querySelectorAll(".delete-review")[0];
  delBtn.addEventListener("click", () => {
    delBtn.parentElement.parentElement.parentElement.parentElement.remove();
  });

  let editBtn = document.querySelectorAll(".edit-btn-rr")[0];
  editBtn.addEventListener("click", () => {
    let review =
      editBtn.parentElement.parentElement.parentElement.parentElement
        .lastElementChild.textContent;
    let filledStar =
      editBtn.parentElement.parentElement.parentElement.parentElement
        .children[1].children[0].innerHTML;

    const filledStarCount = (filledStar.match(/icons\/filledstar\.svg/g) || [])
      .length;
    console.log(filledStarCount);
    document.getElementById("rateValue").value = filledStarCount;
    document.getElementById("calculate-word-len").innerHTML = review.trim();
    let stars = document.querySelectorAll(".rating-star-container div.star");
    for (let i = 0; i < filledStarCount; i++) {
      stars[i].classList.add("active");
    }
    let btn = document.querySelector(".review-post-btn");
    btn.disabled = false;
    btn.textContent = "UPDATE";
    document.querySelector(".review-input-container").classList.add("active");

    btn.addEventListener("click", () => {
      let stars = document.querySelectorAll(
        ".rating-star-container .star.active"
      );
      document.getElementById("rateValue").value = stars.length
      editBtn.parentElement.parentElement.parentElement.parentElement.lastElementChild.textContent =
        document.getElementById("calculate-word-len").textContent.trim();
    });
  });
}

//Star animation
let stars = document.querySelectorAll(".rating-star-container .star");
let postBtn = document.querySelector(".review-post-btn");
let feedBack = document.getElementById("calculate-word-len");
let reviewBox = document.querySelector(".review-input-container");
let reviewWritePen = document.querySelector(".write-pen");

reviewWritePen.addEventListener("click", () => {
  reviewBox.classList.toggle("active");
});
stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    stars.forEach((s) => s.classList.remove("active"));
    document.getElementById("rateValue").value = index + 1;
    isValidReview();
    for (let i = 0; i <= index; i++) {
      stars[i].classList.add("active");
    }
  });
});

feedBack.addEventListener("input", isValidReview);

function isValidReview() {
  let feedBack = document.getElementById("calculate-word-len");
  let rateValue = document.getElementById("rateValue").value;
  if (feedBack.value.trim().length > 3 && rateValue != 0) {
    postBtn.disabled = false;
  } else {
    postBtn.disabled = true;
  }
}
postBtn.addEventListener("click", async () => {
  const today = new Date();

  // Get the day, month, and year
  let day = today.getDate();
  let month = today.getMonth() + 1; // Months are zero-based, so add 1
  const year = today.getFullYear();

  // Add leading zeros if day or month is less than 10
  if (day < 10) {
    day = "0" + day;
  }

  if (month < 10) {
    month = "0" + month;
  }

  let feedBack = document.getElementById("calculate-word-len");

  let rateValue = document.getElementById("rateValue");
  let reviewObj = {
    id: Math.floor(Math.random() * 50050),
    username: "Naveen V",
    rating: rateValue.value,
    review: feedBack.value.trim(),
    date: `${year}-${month}-${day}`,
  };

  dynamictemplate(reviewObj);

  let req = await fetch("http://localhost:4000/api/v1/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewObj),
  });
  let res = await req.json();
  console.log(res);

  feedBack.value = "";
  rateValue.vlaue = 0;
  stars.forEach((s) => s.classList.remove("active"));
  reviewBox.classList.remove("active");
  postBtn.disabled = true;
});

function loadBars() {
  let currentNum = ["oneStar", "twoStar", "threeStar", "fourStar", "fiveStar"];
  let oneStar = 0;
  let twoStar = 0;
  let threeStar = 0;
  let fourStar = 0;
  let fiveStar = 0;

  reviewData.forEach((data) => {
    if (data.rating == 1) {
      oneStar++;
    } else if (data.rating == 2) {
      twoStar++;
    } else if (data.rating == 3) {
      threeStar++;
    } else if (data.rating == 4) {
      fourStar++;
    } else {
      fiveStar++;
    }
  });
  let totalReviews = reviewData.length;
  document.querySelector(".bar-rating-5 .child-bar-line").style.width =
    (fiveStar / totalReviews) * 100 + "%";
  document.querySelector(".bar-rating-4 .child-bar-line").style.width =
    (fourStar / totalReviews) * 100 + "%";
  document.querySelector(".bar-rating-3 .child-bar-line").style.width =
    (threeStar / totalReviews) * 100 + "%";
  document.querySelector(".bar-rating-2 .child-bar-line").style.width =
    (twoStar / totalReviews) * 100 + "%";
  document.querySelector(".bar-rating-1 .child-bar-line").style.width =
    (oneStar / totalReviews) * 100 + "%";
}

loadBars();

function dynamictemplate(reviewObj) {
  let template = ` <li class="review-card">
      <div class="review-card-head">
        <div class="review-left-part">
          <div style="background-color:${getRandomColor()}" class="img review-profile">${reviewObj.username
    .charAt(0)
    .toLocaleUpperCase()}</div>
          <p>${reviewObj.username}</p>
        </div>
        <div class="review-operations">
                    <img class="dot svg" src="icons/dot.svg" alt="" />
                    <div class="options" data-account-id="9">
                      <p class="edit-btn">Edit</p>
                      <p class="delete-account">Delete</p>
                    </div>
                  </div>
      </div>
      <div class="review-card-center">
        <div class="reviewed-star">
          ${handleReviewStar(reviewObj.rating)}
        </div>
        <small class="review-date">${reviewObj.date}</small>
      </div>
      <p class="review-text">
        ${reviewObj.review}
      </p>
    </li>`;
  userFeedBack.innerHTML = template + userFeedBack.innerHTML;
}
