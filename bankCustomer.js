export class BankCustomer {
  constructor(balance, outstandingLoanValue) {
    if (typeof balance === "number" && !isNaN(balance)) {
      this.balance = balance;
    } else {
      throw new Error("The balance argument given was not a number!");
    }

    if (
      typeof outstandingLoanValue === "number" &&
      !isNaN(outstandingLoanValue) &&
      outstandingLoanValue >= 0
    ) {
      this.outstandingLoanValue = outstandingLoanValue;
    } else {
      throw new Error(
        "The outstandingLoanValue argument given was not a number!"
      );
    }
  }

  getALoan(amount) {
    if (typeof amount !== "number" || isNaN(amount)) {
      return "Please type a number";
    } else if (amount <= 0) {
      return "The amount must be greater than 0.";
    } else if (this.outstandingLoanValue > 0 || this.balance < 2 * amount) {
      return "You do not qualify for getting a loan.";
    } else {
      // Getting a loan
      this.outstandingLoanValue = amount;
      this.balance += amount;
      return "You got a loan!";
    }
  }

  repayLoan(amount) {
    if (amount >= this.outstandingLoanValue) {
      this.balance += amount - this.outstandingLoanValue;
      this.outstandingLoanValue = 0;
    } else {
      this.outstandingLoanValue -= amount;
    }
  }

  receiveSalary(amount) {
    if (this.outstandingLoanValue >= 0.1 * amount) {
      this.outstandingLoanValue -= 0.1 * amount;
      this.balance += 0.9 * amount;
    } else {
      this.balance += amount - this.outstandingLoanValue;
      this.outstandingLoanValue = 0;
    }
  }

  buySomething(price) {
    if (typeof price === "number" && !isNaN(price)) {
      if (price <= this.balance) {
        this.balance -= price;
        return true; // transaction accepted
      } else {
        return false; // transaction denied
      }
    }
  }
}
