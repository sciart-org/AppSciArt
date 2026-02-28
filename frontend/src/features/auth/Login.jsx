import React, { useState } from "react";
import tokenService from "../../utils/token.service";
import Providers from "./components/Providers";
import AsterButton from "../../components/buttons/AsterButton";
import FormInput from "../../components/form/FormInput";
import useFetcher from "../../utils/useFetcher";
import { Link } from "react-router";
import Loading from "../../components/messages/Loading";

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { fetcher } = useFetcher(error, setError);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetcher({
      url: "login",
      method: "POST",
      body: formData,
      onSuccess: (data) => {
        setFormData({
          email: "",
          password: "",
        });
        tokenService.updateLocalAccessToken(data.jwt);
        tokenService.setUser(data);
        window.location.href = "/";
      },
      onError: () => {
        setLoading(false);
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Log in now</h1>
      <div style={{ margin: "2rem" }}>
        <h3 style={{ margin: 0 }}>Not a member of AppSciArt?</h3>
        <Link to={"/signup"} style={{ margin: 0 }}>
          Register
        </Link>
      </div>
      <div style={{ flex: 1 }}>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-box-container">
            <FormInput
              name={"Email"}
              type={"text"}
              value={formData.email}
              onChange={handleInputChange}
              required={true}
            />
            <FormInput
              name={"Password"}
              type={"password"}
              value={formData.password}
              onChange={handleInputChange}
              required={true}
            />
          </div>
          <AsterButton type="submit" style={{ width: "10rem" }}>
            <text>Log in</text>
          </AsterButton>
        </form>
        <Providers />
      </div>
    </div>
  );
}
