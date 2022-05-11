import React from "react";
import { Form, Accordion, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { projectActions } from "app/slices/projectSlice";
import { deployAndReloadVersion as deploy } from "app/slices/versionSlice";
import deploySvg from "assets/deploy.svg";

const ProjectSetting = () => {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.project);

  const version = useSelector((state) => state.versions.version);
  const versionLoading = useSelector((state) => state.versions.loading);
  const isDeploying = useSelector((state) => state.versions.isDeploying);

  return (
    <>
      <Accordion className="mb-2">
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
                      dispatch(projectActions.setDeploy(!project.is_deployed));
                    }}
                  />
                  <label className="form-check-label">
                    Publish this endpoint
                  </label>
                </div>
              </Form.Group>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div className="d-flex">
        <Button
          variant="primary"
          disabled={versionLoading || !version.is_dirty || isDeploying}
          onClick={() => dispatch(deploy({ projectId: project.id }))}
        >
          {isDeploying ? (
            "Deploying..."
          ) : (
            <>
              {`Deploy `}
              <img
                src={deploySvg}
                className="d-inline-block"
                alt="logo"
                style={{ cursor: "pointer" }}
              />
            </>
          )}
        </Button>
        <p className="form-text text-muted mx-2">
          {versionLoading
            ? "Loading..."
            : version.is_dirty
            ? "You have changes ready to be launched"
            : "No changes to be launched"}
        </p>
      </div>
    </>
  );
};

export default ProjectSetting;
