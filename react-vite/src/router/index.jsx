import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
// import LikesPage from '../components/LikesPage/LikesPage';
import FollowingPage from '../components/FollowingPage/FollowingPage';

import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      // {
      //   path: "/likes",
      //   element: <LikesPage />
      // },
      {
        path: "/following-users",
        element: <FollowingPage />
      },
    ],
  },
]);