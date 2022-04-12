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

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.project);
  const error = useSelector((state) => state.project.error);

  const session = useSelector((state) => state.sessions.session);

  useEffect(() => {
    dispatch(getProjectById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (project && project.session) {
      dispatch(
        getSession({ projectId: project.id, sessionId: project.session.id })
      );
    }
  }, [dispatch, project]);

  useEffect(() => {
    if (project && session) {
      dispatch(getLatestVersion({ projectId: project.id }));
    }
  }, [dispatch, project, session]);

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
          <Button className="ms-auto px-5" variant="primary" size="sm">
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
