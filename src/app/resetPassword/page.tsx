'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/Button';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import Loader from 'react-spinners/ClipLoader';
import AMLogo from '../../assets/am-logo.png';
import { IoIosArrowBack } from 'react-icons/io';
import { TextInput } from '../../components/TextInput';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../services/queries/Session';

const resetPassword = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
});

export default function ResetPassword() {
  const form = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      await sendEmail(value.email);
    },
    validators: {
      onChange: resetPassword,
    },
  });
  const router = useRouter();

  const forgotPasswordQuery = useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });

  async function sendEmail(email: string) {
    try {
      await forgotPasswordQuery.mutateAsync(email);
      toast.success(
        'Email enviado com sucesso. Em instantes verifique sua caixa de entrada.'
      );
      router.push('/signIn');
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message);
        return;
      }
      toast.error(
        'Ocorreu um erro ao tentar enviar o email de esquecimento de senha. Tente novamente em instantes.'
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

      <div className='flex h-min w-full flex-col items-center justify-center'>
        <Image
          src={AMLogo}
          alt='AM Viagens logo'
          width={250}
          height={110}
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
                    data-testid='reset-password-loader-id'
                  />
                ) : (
                  'Enviar email de recuperação'
                )}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
