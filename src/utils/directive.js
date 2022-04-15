const REST_DIRECTIVE_DEFINITION = `directive @rest(
  url: String,
  headers: [NameValueInput],
  method: String,
  setters: [SettersInput],
  params: [NameValueInput],
  resultRoot: String
) on FIELD_DEFINITION

input NameValueInput {
  name: String
  value: String
}

input SettersInput {
  field: String
  path: String
}

`;
export const getDirectivesDefinitions = () => {
  return REST_DIRECTIVE_DEFINITION;
};
