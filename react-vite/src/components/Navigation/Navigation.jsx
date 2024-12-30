import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkLogout } from "../../redux/session";
import { useModal } from "../../context/Modal";
// import OpenModalButton from "../OpenModalButton/OpenModalButton"
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal"
import "./Navigation.css";

function Navigation() {
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { setModalContent } = useModal();

  const handleLogout = () => {
    dispatch(thunkLogout());
  };

  return (
    <nav id="nav-bar">
      <ul>
        {!user ? (
          <>
            <li onClick={() => setModalContent(<LoginFormModal />)}>Log In</li>
            <li onClick={() => setModalContent(<SignupFormModal />)}>Sign Up</li>
          </>
        ) : (
          <>
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/profile")}>Profile</li>
            <li onClick={() => navigate("/likes")}>Likes</li>
            <li onClick={() => navigate("/comments")}>Comments</li>
            <li onClick={() => navigate("/following-users")}>Following</li>
            <li onClick={handleLogout}>Log Out</li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;