import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import './Sidebar.css';

function Sidebar() {
  const user = useSelector((state) => state.session.user);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users/recent');
      const data = await response.json();
      setUsers(data.users);
    };
  
    fetchUsers()
  }, []);  

  return (
    <section id="sidebar">
      {user && (
        <OpenModalButton
          modalComponent={<CreatePostModal />}
          buttonText="Create New Post"
        />
      )}
      <div id="users-list">
        <h3>New Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Sidebar;
