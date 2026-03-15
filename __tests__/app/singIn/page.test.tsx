import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import SignIn from '../../../src/app/signIn/page';
import userEvent from '@testing-library/user-event';
import { AuthProviderMocked } from '../../mocks/AuthProvider';

const mockedSignIn = jest.fn();
function renderSignInPage() {
  return render(AuthProviderMocked(<SignIn />, mockedSignIn));
}

describe('SignIn Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign in form', () => {
    renderSignInPage();

    expect(screen.getByAltText('AM Viagens logo')).toBeInTheDocument();

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();

    expect(screen.getByText('Esqueci a senha')).toBeInTheDocument();
    expect(screen.getByText('Registrar')).toBeInTheDocument();
  });

  it('displays correct placeholder texts', () => {
    renderSignInPage();

    expect(screen.getByPlaceholderText('Digite seu email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
  });

  it('has correct links with proper hrefs', () => {
    renderSignInPage();

    const forgotPasswordLink = screen.getByText('Esqueci a senha').closest('a');
    const signUpLink = screen.getByText('Registrar').closest('a');

    expect(forgotPasswordLink).toHaveAttribute('href', '/resetPassword');
    expect(signUpLink).toHaveAttribute('href', '/signUp');
  });

  it('allows user to type in email and password fields', async () => {
    const user = userEvent.setup();
    renderSignInPage();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('submits form with correct data when valid', async () => {
    const user = userEvent.setup();
    renderSignInPage();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Fill in valid data
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // Submit form
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows loading state when form is submitting', async () => {
    mockedSignIn.mockImplementation(() => new Promise(() => {}));
    const user = userEvent.setup();
    renderSignInPage();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Fill in valid data
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // Submit form
    await user.click(submitButton);

    // Check for loading state
    await waitFor(() => {
      expect(screen.getByTestId('signIn-loader-id')).toBeInTheDocument();
    });
  });

  it('prevents form submission when fields are empty', async () => {
    const user = userEvent.setup();
    renderSignInPage();

    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Try to submit without filling fields
    await user.click(submitButton);

    // signIn should not be called
    expect(mockedSignIn).not.toHaveBeenCalled();
  });
});
