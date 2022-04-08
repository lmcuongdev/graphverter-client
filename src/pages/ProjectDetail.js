import React, { useEffect } from "react";
import Header from "components/Layout/Header";
import { getProjectById } from "app/slices/projectSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.project);
  const error = useSelector((state) => state.project.error);

  useEffect(() => {
    dispatch(getProjectById(id));
  }, [dispatch, id]);

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="text-center">Project {id}</h1>
        {project && <h2>{project.api_path}</h2>}
        {error && <div className="text-danger">{error}</div>}
      </div>
    </>
  );
};

export default ProjectDetail;
