import React, { HTMLInputTypeAttribute, useId } from "react";
import styled from "styled-components";
import colors from "../../constants/colors";

const LoginInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${colors.dark.secondary};
  padding-bottom: 5px;
`;

const InputLabel = styled.label`
  color: ${colors.dark.secondary};
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
`;

const IconInputWrapper = styled.div`
  display: flex;

  > span {
    color: ${colors.dark.secondary};
    user-select: none;
    margin-left: 5px;
    font-size: 24px;
  }
`;

const Input = styled.input`
  width: 100%;
  outline: none;
  border: none;
  background-color: ${colors.dark.primary};
  color: ${colors.dark.secondary};
  margin-left: 5px;
`;

export type TInputType = "password" | "email";

export interface LoginInput {
  inputType: HTMLInputTypeAttribute;
  inputLabel: string;
  inputName: string;
  placeholder: string;
  iconName: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  required: boolean;
  formId: string;
}

function LoginInput(props: LoginInput) {
  const id = useId();

  const {
    inputLabel,
    iconName,
    value,
    onChange,
    inputType,
    placeholder,
    required,
    formId,
    inputName,
  } = props;

  return (
    <LoginInputWrapper>
      <InputLabel htmlFor={id}>{inputLabel}</InputLabel>

      <IconInputWrapper>
        <span className="material-icons-outlined">{iconName}</span>
        <Input
          id={id}
          value={value}
          onChange={onChange}
          type={inputType}
          placeholder={placeholder}
          required={required}
          form={formId}
          name={inputName}
        />
      </IconInputWrapper>
    </LoginInputWrapper>
  );
}

export default LoginInput;
