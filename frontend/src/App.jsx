import { useState } from "react";
import "./App.css";

function ErrorMessage({ name, value, min, max }) {
  if (value < min) {
    return (
      <p className="error-message">
        {name} must be at least {min}.
      </p>
    );
  }
  if (value > max) {
    return (
      <p className="error-message">
        {name} cannot exceed {max}.
      </p>
    );
  }
  return null;
}

function App() {
  const [principal, setPrincipal] = useState(1000);
  const [interestRate, setInterestRate] = useState(5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [serverError, setServerError] = useState("");

  return (
    <div>
      <h1>LoanScope</h1>
      <p>Starting Principal: ${principal}</p>
      <input
        type="number"
        value={principal}
        min="1"
        max="100000000"
        onChange={(e) => setPrincipal(e.target.value)}
      />
      <input
        type="range"
        value={principal}
        min="1"
        max="100000000"
        onChange={(e) => setPrincipal(e.target.value)}
      />
      <ErrorMessage
        name="Starting Principal"
        value={principal}
        min={1}
        max={100000000}
      />
      <p>Interest Rate: {interestRate}%</p>
      <input
        type="number"
        value={interestRate}
        min="0"
        max="40"
        step="0.01"
        onChange={(e) => setInterestRate(e.target.value)}
      />
      <input
        type="range"
        value={interestRate}
        min="0"
        max="40"
        step="0.01"
        onChange={(e) => setInterestRate(e.target.value)}
      />
      <ErrorMessage
        name="Interest Rate"
        value={interestRate}
        min={0}
        max={40}
      />
      <p>Monthly Payment: ${monthlyPayment}</p>
      <input
        type="number"
        value={monthlyPayment}
        min="1"
        max="100000000"
        onChange={(e) => setMonthlyPayment(e.target.value)}
      />
      <input
        type="range"
        value={monthlyPayment}
        min="1"
        max="100000000"
        onChange={(e) => setMonthlyPayment(e.target.value)}
      />
      <ErrorMessage
        name="Monthly Payment"
        value={monthlyPayment}
        min={1}
        max={100000000}
      />
      {serverError && <p className="error-message">{serverError}</p>}
    </div>
  );
}

export default App;
