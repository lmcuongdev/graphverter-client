import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";

import ProjectSetting from "components/ProjectDetail/ProjectSetting";
import Header from "components/Layout/Header";
import SessionConfig from "components/ProjectDetail/SessionConfig";
import { getProjectPageData } from "app/slices/projectSlice";
import { updateAndReloadSession } from "app/slices/sessionSlice";
import { manipulateSchemaTypeName, mergeSchemas } from "utils/converter";
import { toast } from "react-toastify";
import { getDirectivesDefinitions } from "utils/directive";

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.project);
  const error = useSelector((state) => state.project.error);

  const session = useSelector((state) => state.sessions.session);

  useEffect(() => {
    dispatch(getProjectPageData(id));
  }, [dispatch, id]);

  const endpoints = useSelector((state) => state.sessions.endpoints);
  const schemaTexts = endpoints.map((endpoint) => endpoint.suggestedSchemaText);
  const saveSession = () => {
    // Merge schemas
    try {
      // TODO: Validate each endpoint schema first
      const manipulatedSchemas = schemaTexts.map((schema) =>
        manipulateSchemaTypeName(schema)
      );
      let schemaText = getDirectivesDefinitions();
      schemaText += mergeSchemas(...manipulatedSchemas);

      console.log(schemaText);

      // If no error, dispatch updateSession
      dispatch(
        updateAndReloadSession({
          projectId: project.id,
          sessionId: session.id,
          data: { endpoints, schemaText },
        })
      );
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="text-center">Project {id}</h1>

        <h4>Settings</h4>
        {project && (
          <div className="container mb-4 py-3 bg-light rounded shadow">
            <ProjectSetting />
          </div>
        )}
        <div className="d-flex">
          <h4>Schema config</h4>
          <Button
            className="ms-auto px-5"
            variant="primary"
            size="sm"
            onClick={saveSession}
          >
            Save
          </Button>
        </div>
        {session && (
          <div className="container mb-2 py-3 bg-light rounded shadow">
            <SessionConfig />
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDetail;
