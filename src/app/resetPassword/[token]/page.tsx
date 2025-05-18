'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/Button';
import { PasswordInput } from '../../../components/PasswordInput';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import Loader from 'react-spinners/ClipLoader';
import AMLogo from '../../../assets/am-logo.png';
import { use } from 'react';
import { resetPassword } from '../../../services/queries/Session';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'A senha deve ter no mínimo 6 caracteres')
      .max(256, 'A senha deve ter no máximo 256 caracteres'),
    passwordConfirmation: z
      .string()
      .min(6, 'A senha deve ter no mínimo 6 caracteres')
      .max(256, 'A senha deve ter no máximo 256 caracteres'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'As senhas não coincidem',
    path: ['passwordConfirmation'],
  });

export default function ResetPassword({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  const form = useForm({
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
    onSubmit: async ({ value }) => {
      await handleSubmit(value);
    },
    validators: {
      onChange: resetPasswordSchema,
    },
  });
  const router = useRouter();

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      resetPassword(data.password, data.token),
    onSuccess: () => {
      toast.success('Senha atualizada com sucesso!');
      router.push('/signIn');
    },
    onError: (error) => {
      console.log('::error', error);
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message[0]);
        return;
      }
      toast.error('Erro ao tentar atualizar sua senha. Tente novamente.');
    },
  });

  async function handleSubmit(data: {
    password: string;
    passwordConfirmation: string;
  }) {
    resetPasswordMutation.mutate({
      token,
      password: data.password,
    });
  }

  return (
    <div className='relative flex h-80/100 w-80/100 flex-col items-center justify-center overflow-y-auto rounded-lg bg-white p-1 pb-3 shadow-lg md:h-5/6 md:w-2/5 md:p-6'>
      <div className='flex h-full w-full flex-col items-center justify-center'>
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

          <form.Field name='passwordConfirmation'>
            {(field) => {
              return (
                <PasswordInput
                  id={field.name}
                  label='Confirmação de senha'
                  value={field.state.value}
                  onChange={(text) => field.handleChange(text)}
                  placeholder='Repita sua senha'
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
                  <Loader color={'#FFF'} loading={isSubmitting} size={20} />
                ) : (
                  'Atualizar senha'
                )}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
