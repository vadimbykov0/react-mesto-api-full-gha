import React from "react";
import { Link } from "react-router-dom";

import useFormValidation from "../hooks/useFormValidation";

export default function Register({ onRegister }) {
  const { values, errors, isValid, isInputValid, handleChange, reset } = useFormValidation();
  
  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister(values);
    reset();
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Регистрация</h2>
      <form
        name="register"
        className="auth__form"
        noValidate
        onSubmit={handleSubmit}
        
      >
        <fieldset className="auth__fieldset">
          <input
            name="email"
            id="email"
            type="email"
            className={`auth__input ${isInputValid.email === undefined || isInputValid.email ? '' : 'auth__input_error'}`}
            value={values.email ? values.email : ''}
            placeholder="Email"
            maxLength={30}
            onChange={handleChange}
            required
          />
          <span className="auth__error">{errors.email}</span>
          <input
            name="password"
            id="password"
            type="password"
            className={`auth__input ${isInputValid.password === undefined || isInputValid.password ? '' : 'auth__input_error'}`}
            value={values.password ? values.password : ''}
            placeholder="Пароль"
            minLength={8}
            maxLength={10}
            onChange={handleChange}
            required
          />
          <span className="auth__error">{errors.password}</span>
        </fieldset>
        <button
          type="submit"
          className={`auth__submit ${isValid ? '' : 'auth__submit_disabled'}`}
          disabled={!isValid}
        >
          Зарегистрироваться
        </button>
      </form>
      <Link to="/sign-in" className="auth__link">
        Уже зарегистрированы? Войти
      </Link>
    </div>
  );
}