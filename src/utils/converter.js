import { Kind, parse, print } from "graphql";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { uid } from "uid/secure";
import _ from "lodash/core";

import {
  jsonToSchema as convertJsonToSchema,
  validateJson,
} from "@lmcuongdev/json-to-schema/lib";

import { PREDEFINED_SCHEMA_TYPES } from "constants.js";

const DEFAULT_RESPONSE_SCHEMA = `type ResponseData {_: String}`;
/**
 * Convert json to GraphQL schema, use nameSet to manage name collisions
 *
 * @param  {string} jsonInput - JSON string
 * @param  {string} type - "request" or "response"
 * @param  {Set|string[]} nameSet - unique set of type names
 *
 * @return {string} GraphQL schema
 */
export const jsonToSchema = (jsonInput, type, nameSet) => {
  const { error, value } = validateJson(jsonInput);
  if (error) {
    return { error };
  }

  if (!nameSet) {
    nameSet = new Set(PREDEFINED_SCHEMA_TYPES);
  } else {
    nameSet = new Set(nameSet);
  }

  // If json is empty => return empty string
  if (_.isEmpty(value)) {
    const value = type === "request" ? "" : DEFAULT_RESPONSE_SCHEMA;
    return { value };
  }

  // Default result
  let result = { error: 'type must be "request" or "response"' };

  if (type === "request") {
    result = convertJsonToSchema({
      jsonInput,
      nameSet,
      baseType: "Payload_Input",
      definition: "input",
      postfix: "_Input",
    });
  }
  if (type === "response") {
    result = convertJsonToSchema({
      jsonInput,
      nameSet,
      baseType: "ResponseData",
      definition: "type",
    });
  }

  return result;
};

export const mergeSchemas = (...schemas) => {
  // for (const sc of schemas) {
  //   console.log(sc);
  // }
  if (schemas.length === 1) {
    return schemas[0];
  }
  return print(mergeTypeDefs(schemas));
};

export const getSuggestedSchema = (
  schemaText,
  isMutation,
  { url, method, responseJson, queryName }
) => {
  const definitionType = isMutation ? "Mutation" : "Query";
  const responseTypeName = Array.isArray(JSON.parse(responseJson))
    ? "[ResponseData]"
    : "ResponseData";

  // If there's no Payload_Input suggested previously, returns empty string
  const suggestedInput =
    isMutation && schemaText.includes("Payload_Input")
      ? "(_payload: Payload_Input)"
      : "";

  let schema = `type ${definitionType} {
  ${queryName}${suggestedInput}: ${responseTypeName}
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

const getRegexString = (str) => `\\\\"|"(?:\\\\"|[^"])*"|(${str})`;
const getRegexStringInputs = (type_) => [
  `type\\s+${type_}\\W`,
  `:\\s+${type_}\\W`,
  `input\\s+${type_}\\W`,
  `:\\s+(\\[\\s*)+${type_}\\s*\\]`,
];

/**
 * Returns all types and inputs in a schema
 * @param  {string} schemaText - GraphQL schema
 * @return {[string]} List of types and inputs
 */
const getTypes = (schemaText) =>
  parse(schemaText)
    .definitions.filter(
      (each) =>
        [
          Kind.OBJECT_TYPE_DEFINITION,
          Kind.INPUT_OBJECT_TYPE_EXTENSION,
        ].includes(each.kind) &&
        !PREDEFINED_SCHEMA_TYPES.includes(each.name.value)
    )
    .map((each) => {
      return each.name.value;
    });

/**
 * @param  {string} schemaText - GraphQL schema text
 *
 * @return {string} - new GraphQL schema text whose type names be updated with unique postfix
 */
export const manipulateSchemaTypeName = (schemaText) => {
  // Generate unique postfix
  const postfix = `_${uid(10)}`;

  // Get all the types and inputs in the schema
  const types = getTypes(schemaText);

  // Use regex to find matched type in typeDefs, need to match these
  // `type Name`, `input Name` `: *[Name]*`, `: Name`, make sure it's not in quotes
  let solvedSchema = schemaText;
  for (const type_ of types) {
    const newTypeName = type_ + postfix;
    for (const regexInput of getRegexStringInputs(type_)) {
      const regex = new RegExp(getRegexString(regexInput), "g");
      solvedSchema = solvedSchema.replace(regex, (match, groupMatch) => {
        if (!groupMatch) return match;
        return groupMatch.replace(type_, newTypeName);
      });
    }
  }

  return solvedSchema;
};
