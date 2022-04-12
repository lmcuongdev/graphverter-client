import _ from "lodash";

// Convert object keys to camel case
export const toCamelCase = (object) => {
  if (typeof object !== "object") {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map((item) => toCamelCase(item));
  }

  return Object.keys(object).reduce((acc, key) => {
    acc[_.camelCase(key)] = toCamelCase(object[key]);
    return acc;
  }, {});
};

// Convert object keys to snake case
export const toSnakeCase = (object) => {
  if (typeof object !== "object") {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map((item) => toSnakeCase(item));
  }

  return Object.keys(object).reduce((acc, key) => {
    acc[_.snakeCase(key)] = toSnakeCase(object[key]);
    return acc;
  }, {});
};
