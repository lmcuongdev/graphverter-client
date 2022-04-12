import _ from "lodash";

// Convert object keys to camel case
export const toCamelCase = (object) => {
  if (typeof object !== "object") {
    return object;
  }

  return Object.keys(object).reduce((acc, key) => {
    acc[_.camelCase(key)] = object[key];
    return acc;
  }, {});
};

// Convert object keys to snake case
export const toSnakeCase = (object) => {
  if (typeof object !== "object") {
    return object;
  }

  return Object.keys(object).reduce((acc, key) => {
    acc[_.snakeCase(key)] = object[key];
    return acc;
  }, {});
};
