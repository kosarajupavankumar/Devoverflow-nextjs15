'use client';
import React from 'react';

import AuthForm from '@/components/forms/AuthForm';
import { SignUpSchema } from '@/lib/validation';

const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN_Up"
      schema={SignUpSchema}
      defaultValues={{ email: '', password: '', name: '', username: '' }}
      onSubmit={(data) => Promise.resolve({ sucess: true, data })}
    />
  );
};

export default SignUp;