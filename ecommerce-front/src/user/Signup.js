import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { signup } from "../auth";
import { API } from "../config";

const Signup = () => {
    const [values, setValues] = useState({
        name: "",
        lastname: "",
        phonenumber: "",
        email: "",
        password: "",
        password1: "",
        error: "",
        success: false
    });

    const { name, lastname, phonenumber, email, password, password1, success, error } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };


    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false });
        signup({ name, lastname, phonenumber, email, password, password1 }).then(data => {
            console.log(name,lastname,phonenumber,email,password, password1 )
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                setValues({
                    ...values,
                    name: "",
                    lastname: "",
                    phonenumber: "",
                    email: "",
                    password: "",
                    password1: "",
                    error: "",
                    success: true
                });
            }
        });
    };

    const signUpForm = () => (
        <form id="miformulario" onsubmit="verificarPasswords(); return false">
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={handleChange("name")}
                    type="text"
                    className="form-control"
                    value={name}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Last Name</label>
                <input
                    onChange={handleChange("lastname")}
                    type="text"
                    className="form-control"
                    value={lastname}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Phone Number</label>
                <input
                    onChange={handleChange("phonenumber")}
                    type="text"
                    className="form-control"
                    value={phonenumber}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={handleChange("email")}
                    type="email"
                    className="form-control"
                    value={email}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Confirm Password</label>
                <input
                    onChange={handleChange("password1")}
                    type="password"
                    className="form-control"
                    value={password1}
                />
            </div>

            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    const showError = () => (
        <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
        >
            {error}
        </div>
    );

    const showSuccess = () => (
        <div
            className="alert alert-info"
            style={{ display: success ? "" : "none" }}
            
        >
            New account is created. Please <Link to="/signin">Signin</Link>
        </div>
        
    );

    return (
        <Layout
            title="Signup"
            description="Signup to Node React E-commerce App"
            className="container col-md-8 offset-md-2"
        >
            {showSuccess()}
            {showError()} 
            {signUpForm()}
        </Layout>
    );
};

export default Signup;
