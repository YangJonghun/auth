import React, { useState } from "react";
import gql from "graphql-tag";
import { useRegisterMutation } from "../generated/graphql";

gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

interface Props {}

const Register: React.FC<Props> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register] = useRegisterMutation();

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        const response = await register({
          variables: {
            email,
            password
          }
        });
        console.log(response);
      }}
    >
      <div>
        <input value={email} placeholder="email" onChange={e => setEmail(e.target.value)} />
        <input
          value={password}
          type="password"
          placeholder="password"
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">register</button>
    </form>
  );
};

export default Register;
