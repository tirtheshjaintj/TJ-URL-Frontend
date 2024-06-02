import { Fragment } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import Cookie from "universal-cookie";
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { removeUser } from '../store/userSlice';

// Define the Navbar component
export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookie = new Cookie();
  const token=cookie.get('token');
  // Logout function
  const logout = () => {
    const cookie = new Cookie();
    cookie.remove('token');
    dispatch(removeUser());
    navigate('/login');
  }

  return (
    <Disclosure as="nav" className="bg-gray-800 fixed w-full z-10">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              {/* Logo */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/"><h1 className='text-2xl dark:text-white font-bold'>TJ URL Shortener</h1></Link>
                </div>
              </div>
              {/* Logout button */}
              {token && (
                <div >
                  <button onClick={logout} className="px-4 flex flex-col item py-2 text-sm items-center text-gray-300 hover:bg-gray-700 font-bold"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">

  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
</svg><span className="hidden sm:block">Logout</span></button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}