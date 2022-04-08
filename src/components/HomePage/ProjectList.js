import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import moment from "moment";

const ProjectList = ({ projects }) => {
  return projects.map((project) => {
    const _project = {
      ...project,
      fullPath: `/${project.api_path}/graphql`,
      lastUpdated: moment(project.lastUpdated).fromNow(),
    };
    return <ProjectItem key={project.id} project={_project} />;
  });
};

const ProjectItem = ({ project }) => {
  return (
    <Card style={{ borderRadius: 20 }}>
      <Card.Header as="h5">{project.name}</Card.Header>
      <Card.Body>
        {/* <Card.Title>{project.name}</Card.Title> */}
        <Card.Text className="mb-1">
          <strong>Deployed at:</strong>{" "}
          <Link to={project.fullPath}>{project.fullPath}</Link>
        </Card.Text>
        <Card.Text style={{ fontSize: 10 }} className="text-secondary">
          Updated {project.lastUpdated}
        </Card.Text>
        <Button variant="primary" as={Link} to={`/projects/${project.id}`}>
          Configure
        </Button>
      </Card.Body>
    </Card>
  );
};
export default ProjectList;
