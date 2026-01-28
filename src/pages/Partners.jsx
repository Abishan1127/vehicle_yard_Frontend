import { useEffect, useState, useMemo } from "react";
import { uid } from "../store/vehicleStore";

export default function Partners() {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [form, setForm] = useState({
    partnerName: "",
    type: "received", // received | given
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
  });

  const [errors, setErrors] = useState({});

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("partnerTransactions");
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  const saveTransactions = (data) => {
    setTransactions(data);
    localStorage.setItem("partnerTransactions", JSON.stringify(data));
  };

  function validateForm() {
    const newErrors = {};

    if (!form.partnerName.trim()) {
      newErrors.partnerName = "Partner name is required";
    }
    if (!form.amount || Number(form.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!form.date) {
      newErrors.date = "Date is required";
    }
    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      partnerName: "",
      type: "received",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
    });
    setErrors({});
  }

  function addTransaction(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const transactionData = {
      partnerName: form.partnerName.trim(),
      type: form.type,
      amount: Number(form.amount),
      date: form.date,
      description: form.description.trim(),
    };

    if (editingId) {
      // Find and replace the exact transaction being edited
      const updated = transactions.map(t => {
        if (t.id === editingId) {
          return {
            id: t.id, // Preserve the original ID
            ...transactionData,
          };
        }
        return t;
      });
      saveTransactions(updated);
      resetForm();
      return;
    }

    const newTransaction = {
      id: uid("trans"),
      ...transactionData,
    };

    saveTransactions([newTransaction, ...transactions]);
    resetForm();
  }

  function startEdit(t) {
    const confirmed = confirm(
      `You are editing this transaction:\n\nPartner: ${t.partnerName}\nType: ${t.type === "received" ? "Money Received" : "Money Given"}\nAmount: Rs. ${t.amount.toLocaleString()}\nDate: ${t.date}\n\nClick OK to continue editing or Cancel to add a new transaction instead.`
    );
    
    if (!confirmed) return;

    setEditingId(t.id);
    setForm({
      partnerName: t.partnerName,
      type: t.type,
      amount: String(t.amount),
      date: t.date,
      description: t.description,
    });
  }

  function deleteTransaction(id) {
    const updated = transactions.filter(t => t.id !== id);
    saveTransactions(updated);
    if (editingId === id) resetForm();
  }

  // Filter transactions by partner name
  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return transactions;
    const term = searchTerm.toLowerCase();
    return transactions.filter(t =>
      t.partnerName.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term)
    );
  }, [transactions, searchTerm]);

  // Get unique partners
  const partners = useMemo(() => {
    const partnerSet = new Set(transactions.map(t => t.partnerName));
    return Array.from(partnerSet).sort();
  }, [transactions]);

  // Calculate balances per partner
  const partnerBalances = useMemo(() => {
    const balances = {};
    transactions.forEach(t => {
      if (!balances[t.partnerName]) {
        balances[t.partnerName] = { received: 0, given: 0 };
      }
      if (t.type === "received") {
        balances[t.partnerName].received += t.amount;
      } else {
        balances[t.partnerName].given += t.amount;
      }
    });
    return balances;
  }, [transactions]);

  // Calculate totals
  const totals = useMemo(() => {
    const total = {
      received: 0,
      given: 0,
    };
    transactions.forEach(t => {
      if (t.type === "received") {
        total.received += t.amount;
      } else {
        total.given += t.amount;
      }
    });
    return total;
  }, [transactions]);

  const netBalance = totals.received - totals.given;

  return (
    <div>
      <h3 className="mb-4">Partner Transactions</h3>

      {/* Add/Edit Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editingId ? "Edit Transaction" : "Add Transaction"}</h5>
          {!editingId && (
            <div className="alert alert-info mb-3" role="alert">
              <small>
                <strong>Tip:</strong> For each transaction with a partner, add a separate entry. For example: add "Received 5000" first, then add "Given 6000" to get a net balance of -1000. Don't edit - delete and add a new one instead!
              </small>
            </div>
          )}

          <form onSubmit={addTransaction}>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label">Partner Name *</label>
                <input
                  type="text"
                  className={`form-control ${errors.partnerName ? "is-invalid" : ""}`}
                  name="partnerName"
                  value={form.partnerName}
                  onChange={handleChange}
                  list="partnerList"
                  placeholder="Select or enter partner name"
                />
                <datalist id="partnerList">
                  {partners.map(partner => (
                    <option key={partner} value={partner} />
                  ))}
                </datalist>
                {errors.partnerName && (
                  <div className="invalid-feedback d-block">{errors.partnerName}</div>
                )}
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label">Type *</label>
                <select
                  className={`form-select ${errors.type ? "is-invalid" : ""}`}
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="received">Money Received from Partner</option>
                  <option value="given">Money Given to Partner</option>
                </select>
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label">Amount (Rs.) *</label>
                <input
                  type="number"
                  className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                />
                {errors.amount && (
                  <div className="invalid-feedback d-block">{errors.amount}</div>
                )}
              </div>

              <div className="col-12 col-md-2">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className={`form-control ${errors.date ? "is-invalid" : ""}`}
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
                {errors.date && (
                  <div className="invalid-feedback d-block">{errors.date}</div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label">Description *</label>
                <textarea
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter transaction description (e.g., Payment for vehicle sale, Interest payment, etc.)"
                  rows="2"
                ></textarea>
                {errors.description && (
                  <div className="invalid-feedback d-block">{errors.description}</div>
                )}
              </div>

              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Update" : "Add Transaction"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Totals Summary */}
      {transactions.length > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <h6 className="text-muted">Money Received</h6>
                <p className="fs-5 fw-bold text-success">Rs. {totals.received.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <h6 className="text-muted">Money Given</h6>
                <p className="fs-5 fw-bold text-danger">Rs. {totals.given.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <h6 className="text-muted">Net Balance</h6>
                <p className={`fs-5 fw-bold ${netBalance >= 0 ? "text-success" : "text-danger"}`}>
                  Rs. {netBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partner Balances */}
      {Object.keys(partnerBalances).length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Partner Balances</h5>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead className="table-light">
                  <tr>
                    <th>Partner Name</th>
                    <th className="text-end">Received</th>
                    <th className="text-end">Given</th>
                    <th className="text-end">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(partnerBalances).map(([name, balance]) => {
                    const partnerBalance = balance.received - balance.given;
                    return (
                      <tr key={name}>
                        <td className="fw-semibold">{name}</td>
                        <td className="text-end text-success">Rs. {balance.received.toLocaleString()}</td>
                        <td className="text-end text-danger">Rs. {balance.given.toLocaleString()}</td>
                        <td className="text-end">
                          <span className={partnerBalance >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                            Rs. {partnerBalance.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Search */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">All Transactions</h5>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by partner name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <small className="text-muted">Showing {filteredTransactions.length} of {transactions.length} transactions</small>
          </div>

          {filteredTransactions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Partner Name</th>
                    <th>Type</th>
                    <th className="text-end">Amount</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th style={{ minWidth: 150 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(t => (
                    <tr key={t.id}>
                      <td className="fw-semibold">{t.partnerName}</td>
                      <td>
                        <span className={`badge ${t.type === "received" ? "text-bg-success" : "text-bg-danger"}`}>
                          {t.type === "received" ? "Received" : "Given"}
                        </span>
                      </td>
                      <td className="text-end fw-semibold">Rs. {t.amount.toLocaleString()}</td>
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                      <td className="text-muted">{t.description}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => startEdit(t)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this transaction?")) {
                                deleteTransaction(t.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              {transactions.length === 0 ? "No transactions yet" : "No transactions match your search"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
