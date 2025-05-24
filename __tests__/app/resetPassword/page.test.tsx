import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import ResetPassword from '../../../src/app/resetPassword/page';
import userEvent from '@testing-library/user-event';
import { forgotPassword } from '../../../src/services/queries/Session';
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

jest.mock('../../../src/services/queries/Session');
const mockedForgotPassword = forgotPassword as jest.MockedFunction<
  typeof forgotPassword
>;

const toast = toastImplementation as jest.Mocked<typeof toastImplementation>;
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

function renderResetPasswordPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ResetPassword />
    </QueryClientProvider>
  );
}

describe('ResetPassword Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the reset password form with all elements', () => {
    renderResetPasswordPage();

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /enviar email de recuperação/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /am viagens logo/i })
    ).toBeInTheDocument();
  });

  it('displays correct placeholder text', () => {
    renderResetPasswordPage();

    expect(screen.getByPlaceholderText('Digite seu email')).toBeInTheDocument();
  });

  it('has back arrow button', () => {
    renderResetPasswordPage();

    const backArrow = screen.getByTestId('back-arrow');
    expect(backArrow).toBeInTheDocument();
  });

  it('allows user to type in email field', async () => {
    const user = userEvent.setup();
    renderResetPasswordPage();

    const emailInput = screen.getByLabelText('Email');

    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('submits form with correct email when valid', async () => {
    mockedForgotPassword.mockResolvedValue({ data: { success: true } });
    const user = userEvent.setup();
    renderResetPasswordPage();

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', {
      name: /enviar email de recuperação/i,
    });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedForgotPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('shows success toast and redirects on successful email send', async () => {
    mockedForgotPassword.mockResolvedValue({ data: { success: true } });
    const user = userEvent.setup();
    renderResetPasswordPage();

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', {
      name: /enviar email de recuperação/i,
    });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Email enviado com sucesso. Em instantes verifique sua caixa de entrada.'
      );
      expect(mockPush).toHaveBeenCalledWith('/signIn');
    });
  });

  it('shows error toast when API call fails with Axios error', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Email não encontrado',
        },
      },
    };

    mockedForgotPassword.mockRejectedValue(mockError);

    const user = userEvent.setup();
    renderResetPasswordPage();

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', {
      name: /enviar email de recuperação/i,
    });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email não encontrado');
    });
  });

  it('shows generic error toast when API call fails with non-Axios error', async () => {
    mockedForgotPassword.mockRejectedValue(new Error('Network error'));

    const user = userEvent.setup();
    renderResetPasswordPage();

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', {
      name: /enviar email de recuperação/i,
    });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Ocorreu um erro ao tentar enviar o email de esquecimento de senha. Tente novamente em instantes.'
      );
    });
  });

  it('shows loading state when form is submitting', async () => {
    mockedForgotPassword.mockImplementation(() => new Promise(() => {})); // Never resolves
    const user = userEvent.setup();
    renderResetPasswordPage();

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', {
      name: /enviar email de recuperação/i,
    });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByTestId('reset-password-loader-id')
      ).toBeInTheDocument();
    });
  });

  it('prevents form submission when email field is empty', async () => {
    const user = userEvent.setup();
    renderResetPasswordPage();

    const submitButton = screen.getByRole('button', {
      name: /enviar email de recuperação/i,
    });

    await user.click(submitButton);

    expect(mockedForgotPassword).not.toHaveBeenCalled();
  });

  it('prevents form submission when email is invalid', async () => {
    const user = userEvent.setup();
    renderResetPasswordPage();

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', {
      name: /enviar email de recuperação/i,
    });

    await user.type(emailInput, 'invalid-email'); // Invalid email format
    await user.click(submitButton);

    expect(mockedForgotPassword).not.toHaveBeenCalled();
  });

  it('navigates back to sign in when back arrow is clicked', async () => {
    const user = userEvent.setup();
    renderResetPasswordPage();

    const backArrow = screen.getByTestId('back-arrow');

    await user.click(backArrow);

    expect(mockPush).toHaveBeenCalledWith('/signIn');
  });

  it('submit button is enabled when valid email is entered', async () => {
    const user = userEvent.setup();
    renderResetPasswordPage();

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', {
      name: /enviar email de recuperação/i,
    });

    await user.type(emailInput, 'test@example.com');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('displays loader in button when submitting', async () => {
    mockedForgotPassword.mockImplementation(() => new Promise(() => {})); // Never resolves
    const user = userEvent.setup();
    renderResetPasswordPage();

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', {
      name: /enviar email de recuperação/i,
    });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByTestId('reset-password-loader-id')
      ).toBeInTheDocument();
      expect(submitButton).not.toHaveTextContent('Enviar email de recuperação');
    });
  });
});
