'use strict';
const loadAllItems = require('./items.js');
const loadPromotions = require('./promotions.js');
let allItems = loadAllItems();
let promotions = loadPromotions();

function bestCharge(selectedItems) {
  return /*TODO*/;
}

function processInput(inputs) {
  let inputsInformation = [];
  let i = 0;
  for (let item of inputs) {
    let temp = item.split(' x ');
    inputsInformation[i] = {};
    inputsInformation[i].id = temp[0];
    inputsInformation[i].number = temp[1];
    i++;
  }
  return inputsInformation;
}

function getItemsPrice(inputsInformation, allItems) {
  for (let item of inputsInformation) {
    for (let element of allItems) {
      if (item.id === element.id) {
        item.name = element.name;
        item.price = element.price;
        item.sum = item.number * element.price;
      }
    }
  }
  return inputsInformation;
}

function getNondiscountSum(inputsInformation) {
  let nondiscountSum = 0;
  for (let item of inputsInformation) {
    nondiscountSum += item.sum;
  }
  return nondiscountSum;
}

function reduction(inputsInformation, nondiscountSum) {
  let settledItems = {};
  settledItems.items = inputsInformation;
  settledItems.discountType = "reductionPromotion";
  settledItems.discountSum = 6;
  settledItems.allSum = nondiscountSum - settledItems.discountSum;
  return settledItems;
}

function getSum(discountItems) {
  for (let item of discountItems) {
    item.sum = item.price * item.number;
  }
  return discountItems;
}


function productDiscount(inputsInformation, nondiscountSum, promotions) {
  let settledItems = {};
  let discountItems = [];
  let i = 0;
  let itemDiscount = promotions[1].items;
  for (let item of inputsInformation) {
    discountItems[i] = {};
    discountItems[i].id = item.id;
    discountItems[i].name = item.name;
    discountItems[i].number = item.number;
    settledItems.discountProduct = [];
    if (itemDiscount.indexOf(item.id) > -1) {
      discountItems[i].price = item.price / 2;
      // settledItems.discountProduct[i] = item.name;
    } else {
      discountItems[i].price = item.price;
    }
    i++;
  }
  console.log(discountItems);
  discountItems = getSum(discountItems);
  for (let element of inputsInformation) {
    if (itemDiscount.indexOf(element.id) > -1) {
      settledItems.discountProduct.push(element.name);
    }
  }
  settledItems.allSum = getNondiscountSum(discountItems);
  settledItems.discountSum = nondiscountSum - settledItems.allSum;
  settledItems.items = inputsInformation;
  settledItems.discountType = "productPromotion";
  return settledItems;
}

function ownDiscountItem(inputsInformation, promotions) {
  let discountItems = promotions[1].items;
  let isDiscount = function (element) {
    return discountItems.indexOf(element.id) > -1;
  };
  let result = inputsInformation.some(isDiscount, this);
  return result;
}

function bestCharge(inputs) {
  function getBestCharge(inputs, allItems, promotions) {
    let inputsInformation = processInput(inputs);
    inputsInformation = getItemsPrice(inputsInformation, allItems);
    let nondiscountSum = getNondiscountSum(inputsInformation);
    let isproductdiscount = ownDiscountItem(inputsInformation, promotions);
    let isReduction = nondiscountSum >= 30;
    if (isproductdiscount && isReduction) {
      let reductionItems = reduction(inputsInformation, nondiscountSum);
      let productDiscountItems = productDiscount(inputsInformation, nondiscountSum, promotions);
      if (reductionItems.allSum <= productDiscountItems.allSum) {
        return reductionItems;
      } else {
        return productDiscountItems;
      }
    } else if (isReduction) {
      return reduction(inputsInformation, nondiscountSum);

    } else if (isproductdiscount) {
      return productDiscount(inputsInformation, nondiscountSum, promotions);

    } else {
      return inputsInformation;
    }
  }

  function printProducts(productItems) {
    let printItems = '';
    for (let m in productItems) {
      if (m > productItems.length - 1) {
        printItems +=
          `${productItems[m].name} x ${productItems[m].number} = ${productItems[m].sum}元
`;
      }
      printItems = `${printItems}
${productItems[m].name} x ${productItems[m].number} = ${productItems[m].sum}元`;
    }
    return printItems;
  }

  let settledItems = getBestCharge(inputs, allItems, promotions);
  let printItems = '';
  let order = '';
  if (settledItems instanceof Array) {
    printItems = printProducts(settledItems);
    order =
      `============= 订餐明细 =============${printItems}
-----------------------------------
总计：${getNondiscountSum(settledItems)}元
===================================`;
  } else if (settledItems.discountType === "reductionPromotion") {
    printItems = printProducts(settledItems.items);
    order = `============= 订餐明细 =============${printItems}
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：${settledItems.allSum}元
===================================`;
  } else if (settledItems.discountType === "productPromotion") {
    printItems = printProducts(settledItems.items);
    let discountItem = settledItems.discountProduct.join('，');
    order = `============= 订餐明细 =============${printItems}
-----------------------------------
使用优惠:
指定菜品半价(${discountItem})，省${settledItems.discountSum}元
-----------------------------------
总计：${settledItems.allSum}元
===================================`;
  }
  return order;
}

module.exports = bestCharge;
