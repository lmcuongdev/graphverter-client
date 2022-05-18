import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";
import moment from "moment";
import { MDBInput } from "mdb-react-ui-kit";
import { createProject } from "app/slices/projectSlice";
import { useDispatch } from "react-redux";

const ProjectList = ({ projects }) => {
  const [added, setAdded] = useState(false);

  const dispatch = useDispatch();
  const [projectName, setProjectName] = useState("");
  const [apiPath, setApiPath] = useState("");

  useEffect(() => {
    setAdded(false);
    setProjectName("");
    setApiPath("");
  }, [projects]);

  return (
    <>
      <Row xs={1} md={2} lg={3} className="g-4">
        {projects.map((project) => {
          const _project = {
            ...project,
            fullPath: `/${project.api_path}/graphql`,
            lastUpdated: moment(project.lastUpdated).fromNow(),
          };
          return (
            <Col key={project.id}>
              <ProjectItem project={_project} />
            </Col>
          );
        })}
        {added ? (
          <Col>
            <Card className="mb-2 shadow">
              <Card.Header as="h5" className="bg-primary text-light d-flex">
                New project
                <i
                  role="button"
                  className="fa-regular fa-trash-can ms-auto text-light fs-5"
                  onClick={() => setAdded(false)}
                ></i>
              </Card.Header>
              <Card.Body className="pt-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(createProject({ name: projectName, apiPath }));
                  }}
                >
                  <div className="form-outline mb-4">
                    <MDBInput
                      size="lg"
                      label="Project name"
                      type="text"
                      value={projectName}
                      required
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <MDBInput
                      size="lg"
                      label="API Path"
                      type="text"
                      value={apiPath}
                      required
                      onChange={(e) => setApiPath(e.target.value)}
                    />
                  </div>

                  <Button
                    variant="outline-primary"
                    data-mdb-ripple-color="primary"
                    type="submit"
                  >
                    Create
                  </Button>
                </form>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          <Col>
            <div>
              <Button
                variant="outline-primary"
                data-mdb-ripple-color="primary"
                onClick={() => setAdded(true)}
              >
                <i className="fa-solid fa-plus"></i> Add
              </Button>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};

const ProjectItem = ({ project }) => {
  return (
    <Card className="mb-2 shadow">
      <Card.Header as="h5" className="bg-light text-dark">
        {project.name}
      </Card.Header>
      <Card.Body className="pt-2">
        {/* <Card.Title>{project.name}</Card.Title> */}
        <Card.Text className="mb-1">
          <strong>Deployed API:</strong>{" "}
          <Link to={project.fullPath}>{project.fullPath}</Link>
        </Card.Text>
        <Card.Text style={{ fontSize: 10 }} className="text-muted">
          Updated {project.lastUpdated}
        </Card.Text>
        <Button variant="primary" as={Link} to={`/projects/${project.id}`}>
          <i className="fa-solid fa-wrench"></i> Configure
        </Button>
      </Card.Body>
    </Card>
  );
};
export default ProjectList;
