import { MDBInput } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";

import Header from "components/Layout/Header";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "app/slices/authSlice";
import _ from "lodash";

const Register = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isValidInput = {
    username: username?.length > 0,
    password: password?.length >= 6 && password.length <= 72,
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(register({ username, password }));
  };

  return (
    <div className="vh-100">
      <Header />
      <section className="">
        {/* <!-- Jumbotron --> */}
        <div className="px-4 py-5 px-md-5 text-center text-lg-start">
          <div className="container">
            <div className="row gx-lg-5 align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <h1 className="my-5 display-4 fw-bold ls-tight">
                  Convert your <span className="text-primary">REST</span> API
                  <br />
                  to{" "}
                  <span className="" style={{ color: "#f444cf" }}>
                    GraphQL
                  </span>
                </h1>
                <p style={{ color: "hsl(217, 10%, 50.8%)" }}>
                  <span className="fw-bold">Graphverter</span> is an all-in-one
                  tool that helps you setup, build and deploy GraphQL API from
                  RESTful API with ease.
                </p>
              </div>

              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="card">
                  <div className="card-body py-5 px-md-5">
                    <form onSubmit={handleRegister}>
                      <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                        <p className="lead fw-bold mb-3 me-3 fs-2">Sign Up</p>
                      </div>
                      <div className="form-outline mb-4">
                        <MDBInput
                          size="lg"
                          label="Username"
                          id="username1"
                          type="text"
                          value={username}
                          required
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>

                      {/* <!-- Password input --> */}
                      <div className="form-outline mb-4">
                        <MDBInput
                          size="lg"
                          label="Password"
                          id="password1"
                          type="password"
                          value={password}
                          required
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      {/* <!-- Submit button --> */}
                      <button
                        type="submit"
                        className={
                          "btn btn-primary btn-block btn-lg mb-4 " +
                          (_.every(_.values(isValidInput)) ? "" : "disabled")
                        }
                      >
                        Sign up
                      </button>
                      <div className="text-center">
                        <p className="small fw-bold mt-2 pt-1 mb-0">
                          Already have an account?{" "}
                          <Link to="/auth/login" className="link-danger">
                            Login now
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Jumbotron --> */}
      </section>
    </div>
  );
};

export default Register;
