'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { PasswordInput } from '../../components/PasswordInput';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import Loader from 'react-spinners/ClipLoader';
import AMLogo from '../../assets/am-logo.png';
import { AuthContext } from '../../Contexts/AuthContext';
import { use } from 'react';

const signInSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),

  password: z
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .max(256, 'A senha deve ter no máximo 256 caracteres'),
});

export default function SignIn() {
  const { signIn } = use(AuthContext);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await handleSubmit(value);
    },
    validators: {
      onChange: signInSchema,
    },
  });

  async function handleSubmit(data: { email: string; password: string }) {
    await signIn({ email: data.email, password: data.password });
  }

  return (
    <div className='relative flex h-80/100 w-80/100 flex-col items-center justify-center overflow-y-auto rounded-lg bg-white p-1 pb-3 shadow-lg md:h-5/6 md:w-3/5 md:p-6 lg:w-2/5'>
      <div className='flex h-min w-full flex-col items-center justify-center'>
        <Image
          src={AMLogo}
          alt='AM Viagens logo'
          width={290}
          height={150}
          unoptimized
        />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className='flex w-full flex-col items-center justify-center'
      >
        <div className='mx-auto w-2/3 space-y-6'>
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

          <div className='m-0 flex flex-col justify-between'>
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

            <Link
              href='/resetPassword'
              className='text-primary-300 ml-auto font-medium hover:underline'
            >
              Esqueci a senha
            </Link>
          </div>

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
                    data-testid='signIn-loader-id'
                  />
                ) : (
                  'Entrar'
                )}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>

      <p className='mx-auto mt-4 text-center text-neutral-700'>
        Ainda não possui conta?{' '}
        <Link
          href='/signUp'
          className='text-primary-400 font-medium hover:underline'
        >
          Registrar
        </Link>
      </p>
    </div>
  );
}
