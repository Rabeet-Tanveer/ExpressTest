import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:3000/api/users';

function LiveUserTable() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const socketRef = useRef(null);
  const pageRef = useRef(page);

  // Keep pageRef in sync with page state
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  // Fetch users from backend
  const fetchUsers = async (pageNum = 1) => {
    try {
      const res = await fetch(`${API_URL}?page=${pageNum}&limit=10`);
      const data = await res.json();
      console.log('Fetched data:', data);
      setUsers(data.user || []);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers(pageRef.current);
    socketRef.current = io(SOCKET_URL);

    const handleUsersUpdated = () => {
      console.log('Received usersUpdated event from socket');
      fetchUsers(pageRef.current);
    };

    socketRef.current.on('usersUpdated', handleUsersUpdated);

    return () => {
      socketRef.current.off('usersUpdated', handleUsersUpdated);
      socketRef.current.disconnect();
    };
    // Only run on mount/unmount
    // eslint-disable-next-line
  }, []);

  // Fetch users when page changes
  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return (
    <div>
      <h2>Live User Table</h2>
      <div>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Names</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LiveUserTable; 