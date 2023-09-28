import useForm from "../hooks/useForm"
import { Link } from "react-router-dom"

export default function Register({ onRegister, buttonText }) {
  
  const { form, handleChange, errors } = useForm({
    email: '',
    password: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(form)
  }
  return (
    <div className={"authentication"}>
      <div className="authentication__container">
        <h2 className="authentication__title">Регистрация</h2>
        <form className="authentication__form" name='Login' onSubmit={handleSubmit}>
          <fieldset className="authentication__fieldset">
            <div className="authentication__field">
              <input
                id="email-input"
                className="authentication__input authentication__input_email"
                type="email"
                placeholder="Email"
                name="email"
                minLength="2"
                maxLength="40"
                value={form.email}
                onChange={handleChange}
                required />
              <span className="authentication__input-error">{errors.email}</span>
            </div>
            <div className="authentication__field">
              <input
                id="password-input"
                className="authentication__input authentication__input_passward"
                type="password"
                placeholder="Пароль"
                name="password"
                minLength="2"
                maxLength="200"
                value={form.password}
                onChange={handleChange}
                required />
              <span className="authentication__input-error">{errors.password}</span>
            </div>
            <button className="authentication__submit-button" type="submit" name="authenticationSubmit">{buttonText}</button>
          </fieldset>
        </form>
        <div className="authentication__link">
          <Link to='/sign-in' className="navbar__link">Уже зарегистрированы? Войти</Link>
        </div>
      </div>
    </div >
  )
}
