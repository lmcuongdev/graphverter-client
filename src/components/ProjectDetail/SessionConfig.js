import React, { useMemo } from "react";
import { Accordion, Form, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Editor from "@monaco-editor/react";
import _ from "lodash";

import {
  jsonToSchema,
  mergeSchemas,
  getSuggestedSchema,
} from "utils/converter";
import { sessionActions } from "app/slices/sessionSlice";
import { confirm } from "components/ConfirmationModal";

const hasPayload = (method) => ["POST", "PUT"].includes(method);

const getEndpointValidations = (endpoints) => {
  return endpoints.map((endpoint) => {
    const errors = {};
    if (endpoint.url === "") {
      errors.url = "URL is required";
    }
    if (hasPayload(endpoint.method) && endpoint.payloadJson) {
      try {
        JSON.parse(endpoint.payloadJson);
      } catch (e) {
        errors.payloadJson = e.message;
      }
    }
    if (endpoint.responseJson) {
      try {
        JSON.parse(endpoint.responseJson);
      } catch (e) {
        errors.responseJson = e.message;
      }
    }
    return errors;
  });
};

const ProjectDetail = () => {
  const dispatch = useDispatch();
  const endpoints = useSelector((state) => state.sessions.endpoints);

  const errors = useMemo(() => getEndpointValidations(endpoints), [endpoints]);

  const {
    handleEndpointDataChange,
    suggestSchema,
    addEndpoint,
    removeEndpoint,
  } = sessionActions;
  const handleEndpointDataChangeDispatch = (index, type, value) => {
    dispatch(handleEndpointDataChange({ index, type, value }));
  };

  const handleFormSubmission = (event, index) => {
    event.preventDefault();
    // Validate first
    if (!_.isEmpty(errors[index])) {
      console.log("Cannot convert to schema", { index });
      return;
    }
    const isMutation = hasPayload(endpoints[index].method);
    const payloadSchema = isMutation
      ? jsonToSchema(endpoints[index].payloadJson, "request")
      : { value: "" };
    const responseSchema = jsonToSchema(
      endpoints[index].responseJson,
      "response"
    );

    if (payloadSchema.error || responseSchema.error) {
      console.log("Cannot convert to schema", { index });
      return;
    }

    const mergedSchema = mergeSchemas(
      payloadSchema.value,
      responseSchema.value
    );
    const suggestedSchema = getSuggestedSchema(
      mergedSchema,
      isMutation,
      endpoints[index]
    );
    dispatch(suggestSchema({ index, schema: suggestedSchema }));
  };

  return (
    <>
      <Accordion defaultActiveKey={0}>
        {endpoints.map((endpoint, index) => (
          <Accordion.Item eventKey={index} key={index} className="my-2">
            <Accordion.Header>
              {endpoint.method} {endpoint.url}
            </Accordion.Header>
            <Accordion.Body>
              <div className="row">
                <div className="col-6" id="left-pane">
                  <Form
                    onSubmit={(event) => handleFormSubmission(event, index)}
                  >
                    <Row className="mb-3">
                      <Form.Group as={Col} md={3}>
                        <Form.Label>Method</Form.Label>
                        <Form.Select
                          value={endpoint.method}
                          onChange={(e) =>
                            handleEndpointDataChangeDispatch(
                              index,
                              "method",
                              e.target.value
                            )
                          }
                        >
                          {["GET", "POST", "PUT", "DELETE"].map((method) => (
                            <option key={method}>{method}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group as={Col} md={9}>
                        <Form.Label>URL</Form.Label>
                        <Form.Control
                          placeholder="https://api.com/"
                          value={endpoint.url}
                          onChange={(e) =>
                            handleEndpointDataChangeDispatch(
                              index,
                              "url",
                              e.target.value
                            )
                          }
                        />
                        {errors[index]?.url && (
                          <div className="text-danger">URL is required</div>
                        )}
                      </Form.Group>
                    </Row>

                    {hasPayload(endpoint.method) && (
                      <Form.Group className="mb-3">
                        <Form.Label>Request payload</Form.Label>
                        <Editor
                          language="json"
                          value={endpoint.payloadJson}
                          theme="vs-dark"
                          height="200px"
                          onChange={(value) => {
                            handleEndpointDataChangeDispatch(
                              index,
                              "payloadJson",
                              value
                            );
                          }}
                        />
                        {errors[index]?.payloadJson && (
                          <div className="text-danger">Invalid JSON</div>
                        )}
                      </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label>Response data</Form.Label>
                      <Editor
                        language="json"
                        value={endpoint.responseJson}
                        theme="vs-dark"
                        height="200px"
                        onChange={(value) => {
                          handleEndpointDataChangeDispatch(
                            index,
                            "responseJson",
                            value
                          );
                        }}
                      />
                      {errors[index]?.responseJson && (
                        <div className="text-danger">Invalid JSON</div>
                      )}
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      disabled={!_.isEmpty(errors[index])}
                      size="sm"
                    >
                      Convert
                    </Button>
                  </Form>
                </div>
                <div className="col-6" id="right-pane">
                  <Form.Group className="mb-3">
                    <Form.Label>Converted schemas</Form.Label>
                    <Editor
                      language="graphql"
                      value={endpoint.suggestedSchemaText}
                      theme="vs-dark"
                      height="400px"
                      onChange={(value) => {
                        handleEndpointDataChangeDispatch(
                          index,
                          "suggestedSchemaText",
                          value
                        );
                      }}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="d-flex">
                <Button
                  variant="danger"
                  onClick={async () =>
                    (await confirm("Are you sure to delete this endpoint?")) &&
                    dispatch(removeEndpoint(index))
                  }
                  className="ms-auto"
                  size="sm"
                >
                  Delete this schema
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
        <Button
          variant="outline-primary"
          onClick={() => dispatch(addEndpoint())}
        >
          + Add
        </Button>
      </Accordion>
    </>
  );
};;

export default ProjectDetail;
