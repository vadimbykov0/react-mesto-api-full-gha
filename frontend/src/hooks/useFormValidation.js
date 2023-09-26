import { useCallback, useState } from "react";

export default function useFormValidation() {
  const [isValid, setValid] = useState(false);
  const [isInputValid, setInputValid] = useState({});
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const setValue = useCallback((name, value) => {
    setValues((oldValues) => {
      return { ...oldValues, [name]: value}
    })
  }, []);

  function reset(data={}) {
    setValues(data);
    setErrors({});
    setValid(false);
    setInputValid({});
  };

  function handleChange(evt) {
    const form = evt.target.form;
    const name = evt.target.name;
    const value = evt.target.value;
    const validationMessage = evt.target.validationMessage;
    const valid = evt.target.validity.valid;

    setValues((oldValues) => {
      return { ...oldValues, [name]: value }
    });

    setErrors((oldErrors) => {
      return { ...oldErrors, [name]: validationMessage }
    });

    setInputValid((oldInputValid) => {
      return { ...oldInputValid, [name]: valid }
    });

    setValid(form.checkValidity());
  };

  return { values, errors, isValid, isInputValid, handleChange, reset, setValue };
}