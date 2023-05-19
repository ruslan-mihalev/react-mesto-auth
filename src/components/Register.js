import {useState} from "react";
import * as auth from '../utils/auth';

const Register = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  return (<div></div>);
};

export default Register;
