const REST_DIRECTIVE_DEFINITION = `directive @rest(
  url: String,
  headers: [_NameValueInput],
  method: String,
  setters: [_SettersInput],
  params: [_NameValueInput],
  resultRoot: String
) on FIELD_DEFINITION

input _NameValueInput {
  name: String
  value: String
}

input _SettersInput {
  field: String
  path: String
}
`;
const COMBINE_DIRECTIVE_DEFINITION = `directive @combine(
  query: String,
  arguments: [_ArgumentInput]
) on FIELD_DEFINITION

input _ArgumentInput {
  name: String
  field: String
  argument: String
}`;
export const getDirectivesDefinitions = () => {
  return REST_DIRECTIVE_DEFINITION + COMBINE_DIRECTIVE_DEFINITION;
};
