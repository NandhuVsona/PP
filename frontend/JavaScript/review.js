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
setTimeout(() => {
  loadReviews();
}, 100);

function isAuthor(review_userId, userId, reviewId) {
  if (review_userId !== userId) {
    return "";
  } else {
    return `<div class="review-operations">
           
                    <img class="dot svg rr-dots" src="icons/dot.svg" alt="" />
                    <div class="options rr-options" data-review-id=${reviewId}>
                      <p class="edit-btn-rr">Edit</p>
                      <p class="delete-review">Delete</p>
                    </div>
                </div>  `;
  }
}
async function loadReviews() {
  let userId = document.querySelector(".home-display-username").dataset;

  let req = await fetch("https://pp-qln0.onrender.com/api/v1/reviews");
  let res = await req.json();

  if (true) {
    let { stats, reviews } = res;
    document.querySelector(".user-feedback").innerHTML = "";
    document.querySelector(".rating-num-left h1").innerHTML = stats.avgRating;
    document.querySelector(".nRating").innerHTML = stats.nRating;
    reviews.forEach((data) => {
      let template = ` <li class="review-card">
        <div class="review-card-head">
          <div class="review-left-part">
            <div style="background-color:${getRandomColor()}" class="img review-profile">${data.user.username
        .charAt(0)
        .toLocaleUpperCase()}</div>
            <p>${data.user.username}</p>
          </div>
          ${isAuthor(data.user._id, userId.userId, data._id)}
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

      let deleteButtons = document.querySelectorAll(".delete-review");

      deleteButtons.forEach((btn, index) => {
        btn.addEventListener("click", (event) => {
          deleteReviewFromServer(event.target.parentElement.dataset.reviewId);
          let reviewCard = event.target.closest(".review-card");

          reviewCard.remove(); // Remove the review from DOM
          console.log("Review deleted");
        });
      });
    });
  }

  attachEditListeners();
  document.querySelectorAll(".rr-dots").forEach((dot, index) => {
    dot.addEventListener("click", () => {
      console.log(index);
      document
        .querySelectorAll(".rr-options")
        [index].classList.toggle("active");
    });
  });
}

function attachEditListeners() {
  // Select all edit buttons
  let editBtns = document.querySelectorAll(".edit-btn-rr");

  editBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", () => {
      // Find the review text
      let reviewTextElement = editBtn
        .closest(".review-card")
        .querySelector(".review-text");
      let reviewText = reviewTextElement.textContent.trim();

      // Find the star rating
      let filledStarsContainer = editBtn
        .closest(".review-card")
        .querySelector(".reviewed-star");
      let filledStarCount = (
        filledStarsContainer.innerHTML.match(/icons\/filledstar\.svg/g) || []
      ).length;

      // Populate edit modal or input fields
      document.getElementById("rateValue").value = filledStarCount;
      document.getElementById("calculate-word-len").textContent = reviewText;

      // Update stars in the modal
      let stars = document.querySelectorAll(".rating-star-container div.star");
      stars.forEach((star, index) => {
        star.classList.toggle("active", index < filledStarCount);
      });

      // Enable update button and change its text
      let updateBtn = document.querySelector(".review-post-btn");
      updateBtn.disabled = false;
      updateBtn.textContent = "UPDATE";

      // Show the review input container for editing
      document.querySelector(".review-input-container").classList.add("active");

      // Handle update on button click
      updateBtn.addEventListener("click", () => {
        // Get the updated stars and review text
        let updatedStarCount = document.querySelectorAll(
          ".rating-star-container .star.active"
        ).length;
        let updatedReviewText = document
          .getElementById("calculate-word-len")
          .textContent.trim();

        // Update the DOM
        filledStarsContainer.innerHTML = generateStarHTML(updatedStarCount);
        reviewTextElement.textContent = updatedReviewText;

        // Close the modal or editing section
        document
          .querySelector(".review-input-container")
          .classList.remove("active");
        updateBtn.textContent = "POST";
        updateBtn.disabled = true;
      });
    });
  });
}

// Call this function after rendering the reviews

// Helper function to generate star HTML
function generateStarHTML(count) {
  let starHTML = "";
  for (let i = 0; i < count; i++) {
    starHTML += `<img src="icons/filledstar.svg" alt="star" />`;
  }
  for (let i = count; i < 5; i++) {
    starHTML += `<img src="icons/emptystar.svg" alt="star" />`;
  }
  return starHTML;
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

  let req = await fetch("https://pp-qln0.onrender.com/api/v1/reviews", {
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

async function deleteReviewFromServer(reviewId) {
  try {
    let response = await fetch(
      `https://pp-qln0.onrender.com/api/v1/reviews/${reviewId}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error("Error deleting review:", error);
  }
}

document.querySelector(".account-back-btn").addEventListener("click", () => {
  document.getElementById("privacy-btn").classList.remove("active");
});
