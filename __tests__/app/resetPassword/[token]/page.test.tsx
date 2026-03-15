import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import ResetPassword from '../../../../src/app/resetPassword/[token]/page';
import userEvent from '@testing-library/user-event';
import { resetPassword } from '../../../../src/services/queries/Session';
import { toast as toastImplementation } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn().mockReturnValueOnce(true),
}));

jest.mock('../../../../src/services/queries/Session');
const mockedResetPassword = resetPassword as jest.MockedFunction<
  typeof resetPassword
>;

const toast = toastImplementation as jest.Mocked<typeof toastImplementation>;
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: jest.fn(),
}));

function renderResetPasswordPage(token = 'token') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const mockParams = Promise.resolve({ token });
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { use } = require('react');
  use.mockReturnValue({ token });

  return render(
    <QueryClientProvider client={queryClient}>
      <ResetPassword params={mockParams} />
    </QueryClientProvider>
  );
}

describe('ResetPassword Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the reset password form with all fields', () => {
    renderResetPasswordPage();

    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmação de senha')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /atualizar senha/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /am viagens logo/i })
    ).toBeInTheDocument();
  });

  it('displays correct placeholder texts', () => {
    renderResetPasswordPage();

    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Repita sua senha')).toBeInTheDocument();
  });

  it('allows user to type in all form fields', async () => {
    const user = userEvent.setup();
    renderResetPasswordPage();

    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmação de senha');

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');

    expect(passwordInput).toHaveValue('newpassword123');
    expect(confirmPasswordInput).toHaveValue('newpassword123');
  });

  it('submits form with correct data when valid', async () => {
    mockedResetPassword.mockResolvedValue({ data: { success: true } });
    const user = userEvent.setup();
    renderResetPasswordPage();

    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmação de senha');
    const submitButton = screen.getByRole('button', {
      name: /atualizar senha/i,
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedResetPassword).toHaveBeenCalledWith(
        'newpassword123',
        'token'
      );
    });
  });

  it('shows success toast and redirects on successful password reset', async () => {
    mockedResetPassword.mockResolvedValue({ data: { success: true } });
    const user = userEvent.setup();
    renderResetPasswordPage();

    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmação de senha');
    const submitButton = screen.getByRole('button', {
      name: /atualizar senha/i,
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Senha atualizada com sucesso!'
      );
      expect(mockPush).toHaveBeenCalledWith('/signIn');
    });
  });

  it('shows error toast when API call fails with Axios error', async () => {
    const mockError = {
      response: {
        data: {
          message: ['Token inválido ou expirado'],
        },
      },
    };

    mockedResetPassword.mockRejectedValue(mockError);

    const user = userEvent.setup();
    renderResetPasswordPage();

    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmação de senha');
    const submitButton = screen.getByRole('button', {
      name: /atualizar senha/i,
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Token inválido ou expirado');
    });
  });

  it('shows generic error toast when API call fails with non-Axios error', async () => {
    mockedResetPassword.mockRejectedValue(new Error('Network error'));

    const user = userEvent.setup();
    renderResetPasswordPage();

    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmação de senha');
    const submitButton = screen.getByRole('button', {
      name: /atualizar senha/i,
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Erro ao tentar atualizar sua senha. Tente novamente.'
      );
    });
  });

  it('prevents form submission when fields are empty', async () => {
    const user = userEvent.setup();
    renderResetPasswordPage();

    const submitButton = screen.getByRole('button', {
      name: /atualizar senha/i,
    });

    await user.click(submitButton);

    expect(mockedResetPassword).not.toHaveBeenCalled();
  });

  it('prevents form submission when passwords do not match', async () => {
    const user = userEvent.setup();
    renderResetPasswordPage();

    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmação de senha');
    const submitButton = screen.getByRole('button', {
      name: /atualizar senha/i,
    });

    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'differentpassword');
    await user.click(submitButton);

    expect(mockedResetPassword).not.toHaveBeenCalled();
  });

  it('prevents form submission when password is too short', async () => {
    const user = userEvent.setup();
    renderResetPasswordPage();

    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmação de senha');
    const submitButton = screen.getByRole('button', {
      name: /atualizar senha/i,
    });

    await user.type(passwordInput, '123'); // Too short (less than 6 characters)
    await user.type(confirmPasswordInput, '123');
    await user.click(submitButton);

    expect(mockedResetPassword).not.toHaveBeenCalled();
  });

  it('submit button is enabled when valid passwords are entered', async () => {
    const user = userEvent.setup();
    renderResetPasswordPage();

    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmação de senha');
    const submitButton = screen.getByRole('button', {
      name: /atualizar senha/i,
    });

    await user.type(passwordInput, 'validpassword123');
    await user.type(confirmPasswordInput, 'validpassword123');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('uses correct token from params', async () => {
    mockedResetPassword.mockResolvedValue({ data: { success: true } });
    const user = userEvent.setup();
    renderResetPasswordPage();

    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmação de senha');
    const submitButton = screen.getByRole('button', {
      name: /atualizar senha/i,
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedResetPassword).toHaveBeenCalledWith(
        'newpassword123',
        'token'
      );
    });
  });

  it('handles mutation onSuccess callback correctly', async () => {
    const user = userEvent.setup();
    renderResetPasswordPage();

    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmação de senha');
    const submitButton = screen.getByRole('button', {
      name: /atualizar senha/i,
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');

    // Trigger successful mutation
    mockedResetPassword.mockResolvedValue({ data: { success: true } });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Senha atualizada com sucesso!'
      );
      expect(mockPush).toHaveBeenCalledWith('/signIn');
    });
  });
});
