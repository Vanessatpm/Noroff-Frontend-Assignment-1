export class Salary {
  constructor(salary) {
    if (typeof salary === "number" && !isNaN(salary) && salary >= 0) {
      this.pay = salary;
    } else {
      throw new Error("The salary argument given was not a number!");
    }
  }

  transferSalaryToBankCustomer(bankCustomer) {
    bankCustomer.receiveSalary(this.pay);
    this.pay = 0;
  }

  repayLoan(bankCustomer) {
    bankCustomer.repayLoan(this.pay);
    this.pay = 0;
  }

  increaseSalaryBy100() {
    this.pay += 100;
  }
}
