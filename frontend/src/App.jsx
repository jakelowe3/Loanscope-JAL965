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
  const [monthlyPayment, setMonthlyPayment] = useState(50);
  const [serverError, setServerError] = useState("");

  const [loanData, setLoanData] = useState(null);

  const handleInterestRateChange = (e) => {
    setInterestRate(e.target.value);
    if (serverError) setServerError("");
  };

  const handlePrincipalChange = (e) => {
    setPrincipal(e.target.value);
    if (serverError) setServerError("");
  };

  const handleMonthlyPaymentChange = (e) => {
    setMonthlyPayment(e.target.value);
    if (serverError) setServerError("");
  };

  const handleExportCSV = () => {
    if (!loanData?.schedule || loanData.schedule.length === 0) return;
    const headers = [
      "Payment Number",
      "Payment Amount",
      "Principal Paid",
      "Interest Paid",
      "Remaining Balance",
    ];
    const rows = loanData.schedule.map((item) => [
      item.payment_number,
      item.payment_amount ?? monthlyPayment,
      item.principal_paid,
      item.interest_paid,
      item.remaining_balance,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8" +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "loan_schedule.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCalculate = async () => {
    if (principal < 1 || principal > 100000000) {
      setServerError("Starting Principal must be between 1 and 100,000,000.");
      return;
    }
    if (interestRate < 0 || interestRate > 40) {
      setServerError("Interest Rate must be between 0 and 40.");
      return;
    }
    if (monthlyPayment < 1 || monthlyPayment > 100000000) {
      setServerError("Monthly Payment must be between 1 and 100,000,000.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          principal: Number(principal),
          annual_rate: Number(interestRate),
          monthly_payment: Number(monthlyPayment),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setServerError(data.detail);
        setLoanData(null);
      } else {
        setServerError("");
        setLoanData(data);
        console.log("Calculated loan data:", data);
      }
    } catch (err) {
      setServerError("Unable to reach backend.");
    }
  };
  const totalMonths = loanData?.months || 0;
  const totalInterestPaid = loanData?.total_interest_paid || 0;
  const payoffDate = loanData?.payoff_date || "";

  const termYears = Math.floor(totalMonths / 12);
  const termMonths = totalMonths % 12;

  return (
    <div>
      <h1>LoanScope</h1>
      <p>Starting Principal: ${principal}</p>
      <input
        type="number"
        value={principal}
        min="1"
        max="100000000"
        onChange={handlePrincipalChange}
      />
      <input
        type="range"
        value={principal}
        min="1"
        max="100000000"
        onChange={handlePrincipalChange}
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
        onChange={handleInterestRateChange}
      />
      <input
        type="range"
        value={interestRate}
        min="0"
        max="40"
        step="0.01"
        onChange={handleInterestRateChange}
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
        onChange={handleMonthlyPaymentChange}
      />
      <input
        type="range"
        value={monthlyPayment}
        min="1"
        max="100000000"
        onChange={handleMonthlyPaymentChange}
      />
      <ErrorMessage
        name="Monthly Payment"
        value={monthlyPayment}
        min={1}
        max={100000000}
      />
      {serverError && <p className="error-message">{serverError}</p>}

      <br />
      <br />
      <button onClick={handleCalculate}>Calculate</button>

      {loanData && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            border: "1px solid black",
          }}
        >
          <h2>Loan Summary</h2>
          <p>
            <b>Payoff Date:</b> {payoffDate}
          </p>
          <p>
            <b>Total Term:</b> {termYears} years, {termMonths} months (
            {totalMonths} months total)
          </p>
          <p>
            <b>Total Interest Paid:</b> ${totalInterestPaid.toLocaleString()}
          </p>
          <p>
            <b>Total Cost:</b> $
            {(Number(principal) + totalInterestPaid).toLocaleString()}
          </p>
        </div>
      )}

      {loanData?.schedule && (
        <div className="schedule-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Amortization Schedule</h2>
            <button onClick={handleExportCSV}>Export CSV</button>
          </div>
          <div className="table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {loanData.schedule.map((row) => (
                  <tr key={row.payment_number}>
                    <td>{row.payment_number}</td>
                    <td>${row.principal_paid}</td>
                    <td>${row.interest_paid}</td>
                    <td>${row.remaining_balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <p style={{ fontSize: "12px", color: "dark gray", marginTop: "32px" }}>
        Disclaimer: This output is an illustrative estimate, not financial
        advice, and may not exactly match a lender's actual amortization terms
        (which can include fees, escrow, or non monthly compounding).
      </p>
    </div>
  );
}

export default App;
