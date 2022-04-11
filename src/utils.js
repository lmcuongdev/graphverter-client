import {
  jsonToSchema as convertJsonToSchema,
  validateJson,
} from "@walmartlabs/json-to-simple-graphql-schema/lib";
import { print } from "graphql";
import { mergeTypeDefs } from "@graphql-tools/merge";
import _ from "lodash/core";

export const jsonToSchema = (jsonInput, type) => {
  // Convert json to graphql, if json is empty => return empty string
  const { error, value } = validateJson(jsonInput);
  if (error) {
    return { error };
  }

  if (_.isEmpty(value)) {
    return { value: "" };
  }
  const baseType = type;
  const prefix = type;
  return convertJsonToSchema({ jsonInput, baseType, prefix });
};

export const mergeSchemas = (...schemas) => {
  if (schemas.length === 1) {
    return schemas[0];
  }
  return print(mergeTypeDefs(schemas));
};
