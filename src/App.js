import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [budget, setBudget] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [spent, setSpent] = useState(0);
  const [symbol, setSymbol] = useState('$');
  const [allocations, setAllocations] = useState({
    Marketing: 0,
    Finance: 0,
    Sales: 0,
    HR: 0,
    IT: 0,
  });

  const currencySymbols = {
    1: '$',
    2: '₹',
    3: '€',
    4: '¥',
  };

  const updateCurrency = (e) => {
    const selectedCurrency = e.target.value;
    setSymbol(currencySymbols[selectedCurrency] || '');
  };

  const updateAllocation = (department, change) => {
    setAllocations((prevAllocations) => {
      const newValue = prevAllocations[department] + change;
      if (newValue < 0) return prevAllocations; // Prevent negative allocation

      const newAllocations = {
        ...prevAllocations,
        [department]: newValue,
      };

      const newTotalSpent = Object.values(newAllocations).reduce((acc, val) => acc + val, 0);
      if (newTotalSpent > budget) {
        alert('You have exceeded your budget limit.');
        return prevAllocations;
      }

      return newAllocations;
    });
  };

  const deleteAllocation = (department) => {
    setAllocations((prevAllocations) => ({
      ...prevAllocations,
      [department]: 0,
    }));
  };

  useEffect(() => {
    const totalSpent = Object.values(allocations).reduce((acc, val) => acc + val, 0);
    setSpent(totalSpent);
    setRemaining(budget - totalSpent);
  }, [budget, allocations]);

  return (
    <div className="App">
      <h1>Company Budget Allocation</h1>
      <div className="main">
        <li className="budget-box">
          <label>Budget</label>
          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value, 10) || 0)}
          />
        </li>
        <li className="remaining-box">
          <label>Remaining:</label>
          <span>{symbol}{remaining}</span>
        </li>
        <li className="spent-box">
          <label>Spent so far:</label>
          <span>{symbol}{spent}</span>
        </li>
        <li className="currency-box">
          <label>Currency</label>
          <select onChange={updateCurrency}>
            <option value="1">Dollar</option>
            <option value="2">Rupee</option>
            <option value="3">Euro</option>
            <option value="4">Yen</option>
          </select>
        </li>
      </div>
      <h2>Allocation</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Allocated Budget</th>
            <th>Increment by 10</th>
            <th>Decrement by 10</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(allocations).map((dept) => (
            <tr key={dept}>
              <td>{dept}</td>
              <td>{symbol}{allocations[dept]}</td>
              <td><button id='b1' onClick={() => updateAllocation(dept, 10)}>+</button></td>
              <td><button id='b2' onClick={() => updateAllocation(dept, allocations[dept] > 0 ? -10 : 0)}>-</button></td>
              <td><button id='b3' onClick={() => deleteAllocation(dept)}>*</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1>Change Allocation</h1>
      <div className="second">
        <li>
          <label>Department</label>
          <select id="options">
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="HR">Human Resource</option>
            <option value="IT">IT</option>
          </select>
        </li>
        <li>
          <label>Action</label>
          <select>
            <option value="add">Add</option>
          </select>
        </li>
        <li>
          <span id="prefix">{symbol}</span>
          <input id="valueInput" type="text" placeholder="Enter value" />
          <button className="save-btn" onClick={handleSave}>Save</button>
        </li>
      </div>
    </div>
  );

  function handleSave() {
    const department = document.getElementById('options').value;
    const value = parseInt(document.getElementById('valueInput').value, 10) || 0;

    if (remaining - value < 0) {
      alert('You have exceeded your budget limit.');
      return;
    }

    setAllocations((prevAllocations) => ({
      ...prevAllocations,
      [department]: (prevAllocations[department] || 0) + value,
    }));
  }
};

export default App;
