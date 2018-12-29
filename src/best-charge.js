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

module.exports = bestCharge;
