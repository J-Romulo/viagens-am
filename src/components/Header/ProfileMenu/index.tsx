import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export function ProfileMenu() {
    return (
        <div className="w-48 bg-white shadow-lg rounded-md overflow-hidden mt-1">
          <nav className="p-2">
            <ul className="space-y-1">
              <li>
                <button className="flex items-center p-2 rounded-md w-full hover:bg-primary-100">
                    <FaUser className="mr-3 text-primary-600 text-lg" />
                    <span className="font-medium text-primary-600">Perfil</span>
                </button>
              </li>
              
              <li className="pt-2 mt-1 border-t">
                <button className="flex items-center p-2 rounded-md w-full hover:bg-primary-100">
                    <FaSignOutAlt className="mr-3 text-primary-600 text-lg" />
                    <span className="font-medium text-primary-600">Sair</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      );
}