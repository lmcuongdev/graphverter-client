import React, { useEffect } from "react";
import Header from "../components/Layout/Header";
import ProjectList from "../components/HomePage/ProjectList";
import { useSelector, useDispatch } from "react-redux";
import { getProjects } from "../app/slices/projectSlice";

const Home = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const loading = useSelector((state) => state.project.loadingProjects);
  const error = useSelector((state) => state.project.error);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="text-center">Projects</h1>
        {loading && <div>Loading...</div>}
        {error && <div className="text-danger">{error}</div>}
        {<ProjectList projects={projects} />}
      </div>
    </>
  );
};

export default Home;
