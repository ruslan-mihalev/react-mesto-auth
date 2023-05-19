import {useState} from "react";
import * as auth from '../utils/auth';
import {useForm} from "../hooks/useForm";

const Register = ({name}) => {

  const {values, handleChange, setValues} = useForm({'email': '', 'password': ''});

  const onSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <form className="auth" name={`${name}__form`} onSubmit={onSubmit}>

      <div className="auth__fields-container">
        <h2 className="form__title form__title_theme_dark">Регистрация</h2>

        <input className="form__input form__input_theme_dark form__input_target_name" id="input-email" name="email"
               required
               type="email" minLength={2} maxLength={30} placeholder="Email"
               value={values.email} onChange={handleChange}/>
        <span className="form__input-error form__input-error_target_name input-card-name-error"/>

        <input className="form__input form__input_theme_dark form__input_target_info" id="input-password"
               name="password"
               required type="password" placeholder="Ссылка на картинку"
               value={values.password} onChange={handleChange}/>
        <span className="form__input-error form__input-error_target_info input-card-image-link-error"/>
      </div>

      <div className="auth__buttons-container">
        <button className="form__button form__button_theme_dark" type="submit">Зарегистрироваться</button>
        <button className="form__button form__button_theme_dark-link" type="button">Уже зарегистрированы? Войти</button>
      </div>
    </form>
  );
};

export default Register;
