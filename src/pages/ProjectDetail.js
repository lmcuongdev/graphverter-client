import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";

import { getSession } from "app/slices/sessionSlice";
import ProjectSetting from "components/ProjectDetail/ProjectSetting";
import Header from "components/Layout/Header";
import SessionConfig from "components/ProjectDetail/SessionConfig";
import { getProjectById } from "app/slices/projectSlice";
import { getLatestVersion } from "app/slices/versionSlice";
import { updateSession } from "app/slices/sessionSlice";
import { mergeSchemas } from "utils/converter";
import { toast } from "react-toastify";

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.project);
  const error = useSelector((state) => state.project.error);

  const session = useSelector((state) => state.sessions.session);
  const shouldReloadSession = useSelector(
    (state) => state.sessions.shouldReloadSession
  );

  useEffect(() => {
    dispatch(getProjectById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (project && project.session && shouldReloadSession) {
      dispatch(
        getSession({ projectId: project.id, sessionId: project.session.id })
      );
    }
  }, [dispatch, project, shouldReloadSession]);

  useEffect(() => {
    if (project && session) {
      dispatch(getLatestVersion({ projectId: project.id }));
    }
  }, [dispatch, project, session]);

  const endpoints = useSelector((state) => state.sessions.endpoints);
  const schemaTexts = endpoints.map((endpoint) => endpoint.suggestedSchemaText);
  const saveSession = () => {
    // Merge schemas
    try {
      const schemaText = mergeSchemas(...schemaTexts);

      console.log(schemaText);

      // If no error, dispatch updateSession
      dispatch(
        updateSession({
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
          <div className="container mb-2 py-3 bg-light rounded">
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
          <div className="container mb-2 py-3 bg-light rounded">
            <SessionConfig />
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDetail;
