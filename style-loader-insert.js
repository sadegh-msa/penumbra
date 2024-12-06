/* eslint-disable no-undef */

function insertIntoTarget(element, options) {
  const parent = options.target || document.head;

  parent.appendChild(element);
}

module.exports = insertIntoTarget;
