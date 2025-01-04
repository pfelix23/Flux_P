import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import LandingPager from '../components/Landing_Page/LandingPager';
import PostPage from '../components/PostPage/PostPage';
import LikesPage from '../components/LikesPage/LikesPage';
import FollowingPage from '../components/FollowingPage/FollowingPage';
import CommentsPage from '../components/CommentsPage/CommentsPage';
import UserPage from '../components/UserPage/UserPage';
import ProfilePage from "../components/ProfilePage/ProfilePage";
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPager />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
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
      },
    ],
  },
]);
