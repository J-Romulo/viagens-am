import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import SignUp from '../../../src/app/signUp/page';
import userEvent from '@testing-library/user-event';
import api from '../../../src/services/api';
import { toast as toastImplementation } from 'react-toastify';

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

jest.mock('../../../src/services/api');
const mockedAPI = api as jest.Mocked<typeof api>;

const toast = toastImplementation as jest.Mocked<typeof toastImplementation>;
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

function renderSignUpPage() {
  return render(<SignUp />);
}

describe('SignUp Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign up form with all fields', () => {
    renderSignUpPage();

    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /cadastrar/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('back-arrow')).toBeInTheDocument();
  });

  it('displays correct placeholder texts', () => {
    renderSignUpPage();

    expect(
      screen.getByPlaceholderText('Digite seu nome completo')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Confirme sua senha')
    ).toBeInTheDocument();
  });

  it('allows user to type in all form fields', async () => {
    const user = userEvent.setup();
    renderSignUpPage();

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');

    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'joao@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    expect(nameInput).toHaveValue('João Silva');
    expect(emailInput).toHaveValue('joao@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  it('submits form with correct data when valid', async () => {
    const user = userEvent.setup();
    renderSignUpPage();

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    // Fill in valid data
    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'joao@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    // Submit form
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedAPI.post).toHaveBeenCalledWith('auth/sign-up', {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });
  });

  it('shows success toast and redirects on successful signup', async () => {
    mockedAPI.post.mockResolvedValue({ data: { success: true } });
    const user = userEvent.setup();
    renderSignUpPage();

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'joao@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Cadastro realizado com sucesso!'
      );
      expect(mockPush).toHaveBeenCalledWith('/signIn');
    });
  });

  it('shows error toast when API call fails with Axios error', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Email já está em uso',
        },
      },
    };

    mockedAPI.post.mockRejectedValue(mockError);

    const user = userEvent.setup();
    renderSignUpPage();

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'joao@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email já está em uso');
    });
  });

  it('shows generic error toast when API call fails with non-Axios error', async () => {
    mockedAPI.post.mockRejectedValue(new Error('Network error'));

    const user = userEvent.setup();
    renderSignUpPage();

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'joao@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Ocorreu um erro ao tentar fazer o cadastro. Tente novamente em instantes.'
      );
    });
  });

  it('shows loading state when form is submitting', async () => {
    mockedAPI.post.mockImplementation(() => new Promise(() => {})); // Never resolves
    const user = userEvent.setup();
    renderSignUpPage();

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'joao@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('signUp-loader-id')).toBeInTheDocument();
    });
  });

  it('prevents form submission when fields are empty', async () => {
    const user = userEvent.setup();
    renderSignUpPage();

    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    await user.click(submitButton);

    expect(mockedAPI.post).not.toHaveBeenCalled();
  });

  it('prevents form submission when passwords do not match', async () => {
    const user = userEvent.setup();
    renderSignUpPage();

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'joao@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'differentpassword');

    await user.click(submitButton);

    expect(mockedAPI.post).not.toHaveBeenCalled();
  });

  it('navigates back to sign in when back arrow is clicked', async () => {
    const user = userEvent.setup();
    renderSignUpPage();

    const backArrow = screen.getByTestId('back-arrow');

    await user.click(backArrow);

    expect(mockPush).toHaveBeenCalledWith('/signIn');
  });

  it('prevents form submission when name is too short', async () => {
    const user = userEvent.setup();
    renderSignUpPage();

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    await user.type(nameInput, 'Jo'); // Too short (less than 3 characters)
    await user.type(emailInput, 'joao@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    await user.click(submitButton);

    expect(mockedAPI.post).not.toHaveBeenCalled();
  });

  it('prevents form submission when password is too short', async () => {
    const user = userEvent.setup();
    renderSignUpPage();

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'joao@example.com');
    await user.type(passwordInput, '123'); // Too short (less than 6 characters)
    await user.type(confirmPasswordInput, '123');

    await user.click(submitButton);

    expect(mockedAPI.post).not.toHaveBeenCalled();
  });

  it('prevents form submission when email is invalid', async () => {
    const user = userEvent.setup();
    renderSignUpPage();

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'invalid-email'); // Invalid email format
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    await user.click(submitButton);

    expect(mockedAPI.post).not.toHaveBeenCalled();
  });
});
