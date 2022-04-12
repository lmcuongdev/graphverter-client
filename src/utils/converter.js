import {
  jsonToSchema as convertJsonToSchema,
  validateJson,
} from "@lmcuongdev/json-to-schema/lib";
import { print } from "graphql";
import { mergeTypeDefs } from "@graphql-tools/merge";
import _ from "lodash/core";

const DEFAULT_RESPONSE_SCHEMA = `type ResponseData {_: String}`;
/**
 * @param  {string} jsonInput - JSON string
 * @param  {string} type - "request" or "response"
 */
export const jsonToSchema = (jsonInput, type) => {
  // If json is empty => return empty string
  const { error, value } = validateJson(jsonInput);
  if (error) {
    return { error };
  }

  if (_.isEmpty(value)) {
    const value = type === "request" ? "" : DEFAULT_RESPONSE_SCHEMA;
    return { value };
  }

  if (type === "request") {
    return convertJsonToSchema({
      jsonInput,
      baseType: "PayloadInput",
      definition: "input",
      postfix: "Input",
    });
  }
  return convertJsonToSchema({
    jsonInput,
    baseType: "ResponseData",
    definition: "type",
  });
};

export const mergeSchemas = (...schemas) => {
  if (schemas.length === 1) {
    return schemas[0];
  }
  return print(mergeTypeDefs(schemas));
};

export const getSuggestedSchema = (schemaText, isMutation, { url, method }) => {
  const definitionType = isMutation ? "Mutation" : "Query";

  // If there's no PayloadInput suggested previously, returns empty string
  const suggestedInput =
    isMutation && schemaText.includes("PayloadInput")
      ? "(_payload: PayloadInput)"
      : "";

  let schema = `type ${definitionType} {
  queryName${suggestedInput}: ResponseData
  @rest(
    url: "${url}"
    method: "${method}"
    headers: []
    params: []
  )
}

`;

  schema += schemaText;
  return schema;
};
