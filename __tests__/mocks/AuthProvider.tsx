import { JSX } from 'react';
import { AuthContext } from '../../src/Contexts/AuthContext';
import { User } from '../../src/@types/User';

export function AuthProviderMocked(
  children: JSX.Element,
  singInFunction = jest.fn().mockImplementation(() => new Promise(() => {}))
) {
  return (
    <AuthContext.Provider
      value={{
        user: {
          _id: 'id',
          name: 'mocked_user',
          email: 'mocked@email.com',
        } as User,
        signIn: singInFunction,
        signOut: () => {},
        updateUserData: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
