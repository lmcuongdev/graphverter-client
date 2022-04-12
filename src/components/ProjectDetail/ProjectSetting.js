import React, { useState } from "react";
import { Form, Accordion } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { projectActions } from "app/slices/projectSlice";

const ProjectSetting = () => {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.project);
  const [isDirty, setIsDirty] = useState(false);

  return (
    <>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Deploy settings</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  placeholder="Project name"
                  value={project.name}
                  disabled
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>API Path</Form.Label>
                <Form.Control
                  placeholder="API Path"
                  value={project.api_path || ""}
                  disabled
                />
                <Form.Text className="text-muted">
                  Your GraphQL endpoint is {process.env.REACT_APP_API_URL}
                  {project.api_path || ""}/graphql
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                {/* <Form.Check type="checkbox" label="Check me out" /> */}
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={project.is_deployed}
                    onChange={() => {
                      // TODO: Call API here
                      setIsDirty(true);
                      dispatch(projectActions.setDeploy(!project.is_deployed));
                    }}
                  />
                  <label className="form-check-label">
                    Deploy this endpoint
                  </label>
                </div>
              </Form.Group>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default ProjectSetting;
