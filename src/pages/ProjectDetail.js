import React, { useEffect } from "react";
import Header from "components/Layout/Header";
import SessionConfig from "components/ProjectDetail/SessionConfig";
import { getProjectById } from "app/slices/projectSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "app/slices/sessionSlice";

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

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="text-center">Project {id}</h1>
        {project && <h2>{project.api_path}</h2>}
        {error && <div className="text-danger">{error}</div>}

        {session && (
          <div className="container">
            <SessionConfig />
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDetail;
