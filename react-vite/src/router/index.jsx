import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import LandingPage from '../components/Landing_Page/LandingPage';
import PostPage from '../components/PostPage/PostPage';
import LikesPage from '../components/LikesPage/LikesPage';
import FollowingPage from '../components/FollowingPage/FollowingPage';
import CommentsPage from '../components/CommentsPage/CommentsPage';
import UserPage from '../components/UserPage/UserPage';
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
      {
        path: "/likes",
        element: <LikesPage />
      },
      {
        path: "/following-users",
        element: <FollowingPage />
      },
      {
        path: "/comments",
        element: <CommentsPage />
      },
      {
        path: "/:username",
        element: <UserPage />
      },
      {
        path: "/posts/:post_id",
        element: <PostPage />
      }
    ],
  },
]);