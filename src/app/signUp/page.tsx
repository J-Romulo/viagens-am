'use client';

import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { IoIosArrowBack } from 'react-icons/io';
import { TextInput } from '../../components/TextInput';
import { PasswordInput } from '../../components/PasswordInput';
import { Button } from '../../components/Button';
import Loader from 'react-spinners/ClipLoader';

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, 'O nome deve ter no mínimo 3 caracteres')
      .max(100, 'O nome deve ter no máximo 100 caracteres'),

    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),

    password: z
      .string()
      .min(6, 'A senha deve ter no mínimo 6 caracteres')
      .max(256, 'A senha deve ter no máximo 256 caracteres'),

    confirmationPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmationPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmationPassword'],
  });

export default function SignUp() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmationPassword: '',
    },
    onSubmit: async ({ value }) => {
      await handleSubmit(value);
    },
    validators: {
      onChange: signUpSchema,
    },
  });
  const router = useRouter();

  async function handleSubmit(data: {
    name: string;
    email: string;
    password: string;
    confirmationPassword: string;
  }) {
    try {
      await api.post('auth/sign-up', {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmationPassword,
      });

      toast.success('Cadastro realizado com sucesso!');
      router.push('/signIn');
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
        return;
      }

      toast.error(
        'Ocorreu um erro ao tentar fazer o cadastro. Tente novamente em instantes.'
      );
    }
  }

  return (
    <div className='relative flex h-80/100 w-80/100 flex-col items-center justify-center overflow-y-auto rounded-lg bg-white p-1 pb-3 shadow-lg md:h-5/6 md:w-3/5 md:p-6 lg:w-2/5'>
      <div
        className='hover:text-primary-500 text-primary-400 absolute top-7 left-7 cursor-pointer rounded-full p-2 transition'
        onClick={() => router.push('/signIn')}
      >
        <IoIosArrowBack
          size={30}
          color='primary-400'
          data-testid='back-arrow'
        />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className='flex h-full w-full flex-col items-center justify-center'
      >
        <div className='mx-auto mt-6 w-2/3 space-y-6'>
          <form.Field name='name'>
            {(field) => {
              return (
                <TextInput
                  id={field.name}
                  label='Nome'
                  type='text'
                  value={field.state.value}
                  onChange={(text) => field.handleChange(text)}
                  placeholder='Digite seu nome completo'
                  required={true}
                />
              );
            }}
          </form.Field>

          <form.Field name='email'>
            {(field) => {
              return (
                <TextInput
                  id={field.name}
                  label='Email'
                  type='email'
                  value={field.state.value}
                  onChange={(text) => field.handleChange(text)}
                  placeholder='Digite seu email'
                  required={true}
                />
              );
            }}
          </form.Field>

          <form.Field name='password'>
            {(field) => {
              return (
                <PasswordInput
                  id={field.name}
                  label='Senha'
                  value={field.state.value}
                  onChange={(text) => field.handleChange(text)}
                  placeholder='Digite sua senha'
                  required={true}
                />
              );
            }}
          </form.Field>

          <form.Field name='confirmationPassword'>
            {(field) => {
              return (
                <PasswordInput
                  id={field.name}
                  label='Confirmar Senha'
                  value={field.state.value}
                  onChange={(text) => field.handleChange(text)}
                  placeholder='Confirme sua senha'
                  required={true}
                />
              );
            }}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type='submit' disabled={!canSubmit} className='mt-8'>
                {isSubmitting ? (
                  <Loader
                    color={'#FFF'}
                    loading={isSubmitting}
                    size={20}
                    data-testid='signUp-loader-id'
                  />
                ) : (
                  'Cadastrar'
                )}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
