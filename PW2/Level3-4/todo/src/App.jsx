import { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    fetch('/todo.json')
      .then((response) => {
        if (!response.ok) throw new Error('Помилка завантаження');
        return response.json(); // Перетворення JSON у об'єкт JavaScript[cite: 17, 31].
      })
      .then((data) => setTodos(data))
      .catch((error) => console.error('Помилка:', error));
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed === true;
    if (filter === 'active') return todo.completed === false;
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTodos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1>Менеджер завдань</h1>

      <div style={{
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
      }}>
        <button onClick={() => handleFilterChange('all')}>Всі</button>
        <button onClick={() => handleFilterChange('completed')}>Завершені</button>
        <button onClick={() => handleFilterChange('active')}>Незавершені</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="perPage">Елементів на сторінці: </label>
        <select id="perPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>

      <ul style={{
        minHeight: '150px',
        listStyle: 'none',
        padding: 0,
        textAlign: 'left',
        display: 'inline-block',
        minWidth: '300px'
      }}>
        {currentItems.map((todo) => (
          <li key={todo.id} style={{
            padding: '10px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input type="checkbox" checked={todo.completed} readOnly />
            <span style={{
              marginLeft: '10px',
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#555' : '#fff'
            }}>
          {todo.title}
        </span>
          </li>
        ))}
      </ul>

      <div style={{
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        justifyContent: 'center'
      }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Назад
        </button>

        <span> Сторінка {currentPage} з {totalPages || 1} </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Вперед
        </button>
      </div>
    </div>
  );
}

export default App;