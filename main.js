import { BankCustomer } from "./bankCustomer.js";
import { Salary } from "./salary.js";
import { fetchLaptops } from "./laptopsDataSource.js";

const BANK_CUSTOMER = new BankCustomer(200, 0);
const SALARY = new Salary(0);

// Bank card elements:
const BALANCE_ELEMENT = document.getElementById("balance");
const OUTSTANDING_LOAN_SECTION_ELEMENT = document.getElementById(
  "card-bank-section-outstanding-loan"
);
const OUTSTANDING_LOAN_ELEMENT = document.getElementById(
  "card-bank-outstanding-loan"
);

// Work card elements:
const PAY_ELEMENT = document.getElementById("pay");
const REPAY_LOAN_BUTTON_ELEMENT = document.getElementById(
  "card-work-button-repay-loan"
);

// Laptop elements:
const DROPDOWN_MENU_FOR_LAPTOPS_ELEMENT =
  document.getElementById("laptops-select");
const SPECS_UL_ELEMENT = document.getElementById("laptop-specs-ul");
const LAPTOP_IMAGE_ELEMENT = document.getElementById("laptop-image");
const LAPTOP_TITLE_ELEMENT = document.getElementById("laptop-title");
const LAPTOP_DESCRIPTION_ELEMENT =
  document.getElementById("laptop-description");
const LAPTOP_PRICE_ELEMENT = document.getElementById("laptop-price");
const LAPTOP_BUY_BUTTON_ELEMENT = document.getElementById("laptop-buy-button");

// Setting up UI:
setUpBankCard();
setUpWorkCard();
setUpLaptopCards();

function setUpBankCard() {
  // Display balance.
  displayTheBalance();

  // Set up the "Get a loan" button.
  document
    .getElementById("card-bank-button-get-a-loan")
    .addEventListener("click", () => {
      BANK_CUSTOMER.getALoan(
        Number(prompt("How much shall you loan (in kr)?"))
      );
      if (BANK_CUSTOMER.outstandingLoanValue > 0) {
        displayTheBalance();
        displayTheOutstandingLoanValue();
        OUTSTANDING_LOAN_SECTION_ELEMENT.style.visibility = "visible";
        REPAY_LOAN_BUTTON_ELEMENT.style.visibility = "visible";
      }
    });
}

function setUpWorkCard() {
  // Display pay.
  displayThePay();

  // Set up the "Bank" button.
  document
    .getElementById("card-work-button-bank")
    .addEventListener("click", () => {
      SALARY.transferSalaryToBankCustomer(BANK_CUSTOMER);
      refreshAfterTransferringSalary();
    });

  // Set up the "Work" button.
  document
    .getElementById("card-work-button-work")
    .addEventListener("click", () => {
      SALARY.increaseSalaryBy100();
      displayThePay();
    });

  // Set up the (hidden) "Repay loan" button.
  REPAY_LOAN_BUTTON_ELEMENT.addEventListener("click", () => {
    SALARY.repayLoan(BANK_CUSTOMER);
    refreshAfterTransferringSalary();
  });
}

async function setUpLaptopCards() {
  const LAPTOPS = await fetchLaptops();

  const BASE_IMAGE_URL = "https://hickory-quilled-actress.glitch.me/";
  const FIRST_LAPTOP = LAPTOPS[0];

  // Set up the dropdown menu with active laptops.
  for (const LAPTOP of LAPTOPS) {
    if (LAPTOP.active) {
      addLaptopToMenu(LAPTOP);
    }
  }

  // Set initial laptop UI
  setLaptopUI(FIRST_LAPTOP);

  // Make UI (features on laptop selection card, as well as the
  // laptop information card) change when a new laptop is selected.
  DROPDOWN_MENU_FOR_LAPTOPS_ELEMENT.addEventListener(
    "change",
    updateLaptopInfo
  );

  // Inner functions:

  function updateLaptopInfo(event) {
    const LAPTOP = LAPTOPS[event.target.selectedIndex];
    setLaptopUI(LAPTOP);
  }

  function setLaptopUI(laptop) {
    //Set select laptop card - features/specs list
    SPECS_UL_ELEMENT.innerHTML = "";
    makeSpecsList(laptop); // li elements

    // Set laptop information card - image:
    setImage(laptop);

    // Set laptop information card - title:
    LAPTOP_TITLE_ELEMENT.innerText = laptop.title;

    // Set laptop information card - description:
    LAPTOP_DESCRIPTION_ELEMENT.innerText = laptop.description;

    // Set laptop information card - price:
    LAPTOP_PRICE_ELEMENT.innerText = formatAmountOfMoney(laptop.price);

    // Set up the "Buy now" button.
    LAPTOP_BUY_BUTTON_ELEMENT.addEventListener("click", setBuyButton);
  }

  function makeSpecsList(laptop) {
    const SPECS_ARRAY = laptop.specs;
    for (const STRING of SPECS_ARRAY) {
      const LIST_ELEMENT = document.createElement("li");
      LIST_ELEMENT.innerText = STRING;
      SPECS_UL_ELEMENT.appendChild(LIST_ELEMENT);
    }
  }

  function setImage(laptop) {
    LAPTOP_IMAGE_ELEMENT.src = BASE_IMAGE_URL + laptop.image;
    LAPTOP_IMAGE_ELEMENT.alt = laptop.title;
  }

  function setBuyButton() {
    const LAPTOP = LAPTOPS[DROPDOWN_MENU_FOR_LAPTOPS_ELEMENT.selectedIndex];
    if (typeof LAPTOP.stock === "number" && LAPTOP.stock > 0) {
      if (BANK_CUSTOMER.buySomething(LAPTOP.price)) {
        LAPTOP.stock--;
        displayTheBalance();
        window.alert("Congratulations with your new laptop!");
      } else {
        window.alert("You cannot afford this laptop.");
      }
    } else {
      window.alert("This laptop is not in stock.");
    }
  }
}

// Auxiliary functions:

function displayTheBalance() {
  BALANCE_ELEMENT.innerText = formatAmountOfMoney(BANK_CUSTOMER.balance);
}

function displayThePay() {
  PAY_ELEMENT.innerText = formatAmountOfMoney(SALARY.pay);
}

function displayTheOutstandingLoanValue() {
  OUTSTANDING_LOAN_ELEMENT.innerText = formatAmountOfMoney(
    BANK_CUSTOMER.outstandingLoanValue
  );
}

function formatAmountOfMoney(amount) {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
  }).format(amount);
}

function refreshAfterTransferringSalary() {
  displayTheBalance();
  displayThePay();
  displayTheOutstandingLoanValue();
  if (BANK_CUSTOMER.outstandingLoanValue === 0) {
    OUTSTANDING_LOAN_SECTION_ELEMENT.style.visibility = "hidden";
    REPAY_LOAN_BUTTON_ELEMENT.style.visibility = "hidden";
  }
}

function addLaptopToMenu(laptop) {
  const OPTION_ELEMENT = document.createElement("option");
  OPTION_ELEMENT.value = laptop.id;
  OPTION_ELEMENT.innerText = laptop.title;
  // Append to DOM.
  DROPDOWN_MENU_FOR_LAPTOPS_ELEMENT.appendChild(OPTION_ELEMENT);
}
