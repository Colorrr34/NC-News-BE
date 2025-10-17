const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.getValueByValue = (object, array, keyInObj, keyInArray, newKey) => {
  const copy = { ...object };

  array.forEach((article) => {
    if (article[keyInArray] === copy[keyInObj]) {
      copy[newKey] = article[newKey];
      delete copy[keyInObj];
    }
  });

  return copy;
};
