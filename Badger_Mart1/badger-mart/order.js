const ITEMS = ["apple", "bagel", "coconut", "donut", "egg"];

const SALES_TAX = {
  AL: 0.04,
  AK: 0.0,
  AZ: 0.056,
  AR: 0.065,
  CA: 0.073,
  CO: 0.029,
  CT: 0.064,
  DE: 0.0,
  DC: 0.06,
  FL: 0.06,
  GA: 0.04,
  HI: 0.04,
  ID: 0.06,
  IL: 0.063,
  IN: 0.07,
  IA: 0.06,
  KS: 0.065,
  KY: 0.06,
  LA: 0.045,
  ME: 0.055,
  MD: 0.06,
  MA: 0.063,
  MI: 0.06,
  MN: 0.069,
  MS: 0.07,
  MO: 0.042,
  MT: 0.0,
  NE: 0.055,
  NV: 0.069,
  NH: 0.0,
  NJ: 0.066,
  NM: 0.051,
  NY: 0.04,
  NC: 0.048,
  ND: 0.05,
  OH: 0.058,
  OK: 0.045,
  OR: 0.0,
  PA: 0.06,
  RI: 0.07,
  SC: 0.06,
  SD: 0.045,
  TN: 0.07,
  TX: 0.063,
  UT: 0.061,
  VT: 0.06,
  VA: 0.053,
  WA: 0.065,
  WV: 0.06,
  WI: 0.05,
  WY: 0.04,
};

function roundMoney(num) {
  return Math.round(num * 100) / 100;
}

function calculateSubtotal() {
  let subTotal = 0;
  for (let itemName of ITEMS) {
    const quantity = parseInt(
      document.getElementById(itemName + "-quantity").value
    );
    const price = parseFloat(
      document.getElementById(itemName + "-price").innerText
    );
    subTotal += quantity * price;
  }

  return subTotal; // TODO calculateSubtotal
}

function calculateSalesTax() {
  const subTotal = calculateSubtotal();
  const state = document.getElementById("state-tax").value;
  const taxRate = getSalesTaxRateForState(state);
  const salesTax = subTotal * taxRate;
  return roundMoney(salesTax); // TODO calculateSalesTax
}

function getSalesTaxRateForState(state) {
  return SALES_TAX[state]; // TODO getSalesTaxRateForState
}

document
  .getElementById("btn-what-is-my-sales-tax")
  .addEventListener("click", () => {
    const state = document.getElementById("state-tax").value;
    alert(
      "The sales tax rate for " +
        state +
        " is " +
        (getSalesTaxRateForState(state) * 100).toFixed(2) +
        "%"
    );
  });

document.getElementById("btn-subtotal").addEventListener("click", () => {
  alert("Your subtotal is: $" + calculateSubtotal().toFixed(2));
});

document.getElementById("btn-sales-tax").addEventListener("click", () => {
  alert("Your sales tax is: $" + calculateSalesTax().toFixed(2));
});

document.getElementById("btn-checkout").addEventListener("click", () => {
  const subTotal = calculateSubtotal();
  const salesTax = calculateSalesTax();
  const total = subTotal + salesTax;
  alert("Your total is: $" + total.toFixed(2));
});
