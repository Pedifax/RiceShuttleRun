"use strict";
// author: Bang-Yen Kao

let playing;
let highest_score = 0;
let current_score = 0;
let button_click = 0;
let all_time_button_click = 0;
let hard_mode_threshold = 10;
let crazy_mode_threshold = 20;

// selecting elements:
let windowEL = document.getElementById("window");
let busEL = document.getElementById("bus");
let enemyDivEL = document.getElementById("enemy_div");
const leftBtnEl = document.getElementById("left_button");
const rightBtnEl = document.getElementById("right_button");
let highestScoreEl = document.getElementById("highest_score");
let currentScoreEl = document.getElementById("current_score");
let buttonClickEL = document.getElementById("button_click");
let allTimeButtonClickEL = document.getElementById("all_time_button_click");

// initialization:
const init = () => {
  playing = true;
  current_score = 0;
  button_click = 0;
  if (localStorage.highest_score) {
    highest_score = Number(localStorage.highest_score);
    highestScoreEl.textContent = highest_score;
  } else {
    localStorage.highest_score = 0;
  }
  if (localStorage.all_time_button_click) {
    all_time_button_click = Number(localStorage.all_time_button_click);
    allTimeButtonClickEL.textContent = all_time_button_click;
  } else {
    localStorage.all_time_button_click = 0;
  }

  enemyDivEL.addEventListener("animationiteration", enemyDropping);
  leftBtnEl.addEventListener("click", goLeft);
  rightBtnEl.addEventListener("click", goRight);
  setInterval(detectCollision, 10);
};

const updateButtonClick = () => {
  if (playing) {
    button_click += 1;
    buttonClickEL.textContent = button_click;
    all_time_button_click += 1;
    allTimeButtonClickEL.textContent = all_time_button_click;
  }
};

const goLeft = () => {
  let bus_class_list = busEL.classList;

  if (bus_class_list.contains("bus_position_right")) {
    bus_class_list.remove("bus_position_right");
    bus_class_list.add("bus_position_middle");
  } else if (bus_class_list.contains("bus_position_middle")) {
    bus_class_list.remove("bus_position_middle");
    bus_class_list.add("bus_position_left");
  }
  updateButtonClick();
};

const goRight = () => {
  let bus_class_list = busEL.classList;

  if (bus_class_list.contains("bus_position_middle")) {
    bus_class_list.remove("bus_position_middle");
    bus_class_list.add("bus_position_right");
  } else if (bus_class_list.contains("bus_position_left")) {
    bus_class_list.remove("bus_position_left");
    bus_class_list.add("bus_position_middle");
  }
  updateButtonClick();
};

const updateDifficulty = () => {
  if (current_score === hard_mode_threshold) {
    enemyDivEL.classList.remove("normal_mode");
    enemyDivEL.classList.add("hard_mode");
  } else if (current_score === crazy_mode_threshold) {
    enemyDivEL.classList.remove("hard_mode");
    enemyDivEL.classList.add("crazy_mode");
  }
};

const updateCurrentScore = () => {
  current_score += 1;
  currentScoreEl.textContent = current_score;
  updateDifficulty();
};

const updateHighestScore = () => {
  if (current_score > highest_score) {
    highest_score = current_score;
    highestScoreEl.textContent = highest_score;
    localStorage.highest_score = highest_score;
  }
};

const updateAllTimeButtonClick = () => {
  localStorage.all_time_button_click = all_time_button_click;
};

const enemyDropping = () => {
  enemyDivEL.classList.remove(
    "enemy_div_position_left",
    "enemy_div_position_middle",
    "enemy_div_position_right"
  );

  let column = Math.floor(Math.random() * 3);
  if (column === 0) {
    enemyDivEL.classList.add("enemy_div_position_left");
  } else if (column === 1) {
    enemyDivEL.classList.add("enemy_div_position_middle");
  } else {
    enemyDivEL.classList.add("enemy_div_position_right");
  }

  updateCurrentScore();
};

const updateLocalStorage = () => {
  updateHighestScore();
  updateAllTimeButtonClick();
};

const endGame = () => {
  updateLocalStorage();
  playing = false;
};

const detectCollision = () => {
  let bus_class = busEL.className;
  let enemy_class = enemyDivEL.classList;

  if (
    (bus_class === "bus_position_left" &&
      enemy_class.contains("enemy_div_position_left")) ||
    (bus_class === "bus_position_middle" &&
      enemy_class.contains("enemy_div_position_middle")) ||
    (bus_class === "bus_position_right" &&
      enemy_class.contains("enemy_div_position_right"))
  ) {
    // when top == [450, 600] -> collide
    let enemy_top_string = getComputedStyle(enemyDivEL).getPropertyValue("top");
    let enemy_top = parseInt(enemy_top_string);

    if (enemy_top >= 450 && enemy_top < 600) {
      enemyDivEL.style.animation = "none";
      endGame();
    }
  }
};

init();
