import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [users, setUsers] = useState([]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [authData, setAuthData] = useState({ username: '', password: '', email: '' });
  const [analytics, setAnalytics] = useState(null);

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setTasks(await res.json());
      else if (res.status === 401) handleLogout();
    } catch (err) { console.error("Tasks fetch error:", err); }
  };

  const fetchUsers = async () => {
    if (role === 'admin' && token) {
      const res = await fetch('/api/auth/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setUsers(await res.json());
    }
  };

  const fetchAnalytics = async () => {
    if (!token) return;
    const res = await fetch('/api/tasks/analytics', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setAnalytics(await res.json());
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchAnalytics();
  }, [token, role]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: authData.username, password: authData.password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      setToken(data.token);
      setRole(data.role);
    } else { alert(data.message); }
  };

  const handleRegister = async () => {
    if (!authData.username || !authData.password || !authData.email) {
      return alert("Please fill all fields!");
    }
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authData)
    });
    const data = await res.json();
    alert(data.message);
  };

  const addTask = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ title: newTaskTitle, dueDate, assignedTo })
    });
    if (res.ok) {
      setNewTaskTitle("");
      setDueDate("");
      await fetchTasks();
    }
  };

  const toggleComplete = async (task) => {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ completed: !task.completed })
    });
    if (res.ok) await fetchTasks();
  };

  const deleteTask = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) await fetchTasks();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    marginBottom: '12px',
    padding: '8px',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #ccc'
  };

  if (!token) return (
    <div style={{ padding: '40px', maxWidth: '350px', margin: 'auto' }}>
      <h2>Authentication</h2>
      <input style={inputStyle} placeholder="Username" onChange={e => setAuthData({...authData, username: e.target.value})} />
      <input style={inputStyle} placeholder="Email" onChange={e => setAuthData({...authData, email: e.target.value})} />
      <input style={inputStyle} type="password" placeholder="Password" onChange={e => setAuthData({...authData, password: e.target.value})} />
      <button onClick={handleLogin} style={{ padding: '8px 16px' }}>Login</button>
      <button onClick={handleRegister} style={{ marginLeft: '10px', padding: '8px 16px' }}>Register</button>
    </div>
  );

  return (
    <div style={{ maxWidth: '550px', margin: 'auto', padding: '20px' }}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0, lineHeight: '1.2' }}>Task Manager</h1>
        <div style={{ color: '#666', fontSize: '0.9em', marginTop: '5px' }}>
          Logged in as: <b>{role}</b>
        </div>
        <button onClick={handleLogout} style={{ marginTop: '10px' }}>Logout</button>
      </header>

      {analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ background: '#e7f3ff', padding: '10px', borderRadius: '5px' }}>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{analytics.total}</div>
            <div style={{ fontSize: '0.7em' }}>Total</div>
          </div>
          <div style={{ background: '#e6ffed', padding: '10px', borderRadius: '5px' }}>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{analytics.completed}</div>
            <div style={{ fontSize: '0.7em' }}>Done</div>
          </div>
          <div style={{ background: '#fff7e6', padding: '10px', borderRadius: '5px' }}>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{analytics.pending}</div>
            <div style={{ fontSize: '0.7em' }}>Pending</div>
          </div>
          <div style={{ background: '#fff1f0', padding: '10px', borderRadius: '5px' }}>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#cf1322' }}>{analytics.overdue}</div>
            <div style={{ fontSize: '0.7em' }}>Overdue</div>
          </div>
        </div>
      )}

      <form onSubmit={addTask} style={{ background: '#fcfcfc', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>New Task:</label>
        <input style={inputStyle} value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Title" required />
        <label style={{ display: 'block', marginBottom: '5px' }}>Due Date:</label>
        <input style={inputStyle} type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

        {role === 'admin' && (
          <>
            <label style={{ display: 'block', marginBottom: '5px' }}>Assign to User:</label>
            <select style={inputStyle} onChange={(e) => setAssignedTo(e.target.value)}>
              <option value="">Myself</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
          </>
        )}
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Create Task</button>
      </form>

      <ul style={{ listStyleType: 'none', padding: 0, marginTop: '30px' }}>
        {tasks.map(task => (
          <li key={task.id} style={{ marginBottom: '15px', padding: '15px', background: '#fff', border: '1px solid #eee', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ textDecoration: task.completed ? 'line-through' : 'none', fontSize: '1.1em', display: 'block' }}>
                  {task.title}
                </strong>
                <div style={{ fontSize: '0.8em', color: '#888', marginTop: '4px' }}>
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No deadline'}
                  {role === 'admin' && ` | Assigned User ID: ${task.userId}`}
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
            </div>
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => toggleComplete(task)}
                style={{ padding: '5px 12px', background: task.completed ? '#6c757d' : '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
              >
                {task.completed ? "Mark Undone" : "Mark Done"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;