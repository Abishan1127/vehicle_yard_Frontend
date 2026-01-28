import { useEffect, useMemo, useState } from "react";
import { loadVehicles } from "../store/vehicleStore";

export default function SoldVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterType, setFilterType] = useState("monthly"); // monthly | yearly

  useEffect(() => {
    setVehicles(loadVehicles());
  }, []);

  // Get sold vehicles only
  const soldVehicles = useMemo(() => {
    return vehicles.filter(v => v.status === "sold");
  }, [vehicles]);

  // Filter by year/month
  const filteredVehicles = useMemo(() => {
    return soldVehicles.filter(v => {
      if (!v.finance?.soldDate) return false;
      const date = new Date(v.finance.soldDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (filterType === "yearly") {
        return year === filterYear;
      } else {
        return year === filterYear && month === filterMonth;
      }
    });
  }, [soldVehicles, filterYear, filterMonth, filterType]);

  // Calculate totals
  const totals = useMemo(() => {
    const totalSoldPrice = filteredVehicles.reduce((sum, v) => sum + (v.finance?.soldPrice || 0), 0);
    const totalBoughtPrice = filteredVehicles.reduce((sum, v) => sum + (v.finance?.boughtPrice || 0), 0);
    const totalMaintenance = filteredVehicles.reduce((sum, v) => {
      const maint = (v.finance?.maintenance || []).reduce((s, m) => s + (m.cost || 0), 0);
      return sum + maint;
    }, 0);
    const totalProfit = totalSoldPrice - totalBoughtPrice - totalMaintenance;

    return { totalSoldPrice, totalBoughtPrice, totalMaintenance, totalProfit };
  }, [filteredVehicles]);

  const years = useMemo(() => {
    const yearSet = new Set();
    soldVehicles.forEach(v => {
      if (v.finance?.soldDate) {
        const year = new Date(v.finance.soldDate).getFullYear();
        yearSet.add(year);
      }
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [soldVehicles]);

  return (
    <div>
      <h3 className="mb-4">Sold Vehicles</h3>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-3">
              <label className="form-label">Filter By</label>
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label">Year</label>
              <select
                className="form-select"
                value={filterYear}
                onChange={(e) => setFilterYear(Number(e.target.value))}
              >
                {years.length > 0 ? (
                  years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))
                ) : (
                  <option>No data</option>
                )}
              </select>
            </div>

            {filterType === "monthly" && (
              <div className="col-12 col-md-3">
                <label className="form-label">Month</label>
                <select
                  className="form-select"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                    <option key={m} value={m}>
                      {new Date(2024, m - 1).toLocaleString("en-US", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="col-12 col-md-3">
              <div className="pt-2">
                <p className="text-muted small m-0">
                  {filterType === "monthly" 
                    ? `${new Date(2024, filterMonth - 1).toLocaleString("en-US", { month: "long" })} ${filterYear}`
                    : `Year ${filterYear}`
                  }
                </p>
                <p className="small m-0">{filteredVehicles.length} vehicles sold</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Totals Card */}
      {filteredVehicles.length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="row text-center">
              <div className="col-md-3">
                <h6 className="text-muted">Total Bought Price</h6>
                <p className="fs-5 fw-bold">Rs. {totals.totalBoughtPrice.toLocaleString()}</p>
              </div>
              <div className="col-md-3">
                <h6 className="text-muted">Total Maintenance</h6>
                <p className="fs-5 fw-bold text-warning">Rs. {totals.totalMaintenance.toLocaleString()}</p>
              </div>
              <div className="col-md-3">
                <h6 className="text-muted">Total Sold Price</h6>
                <p className="fs-5 fw-bold text-success">Rs. {totals.totalSoldPrice.toLocaleString()}</p>
              </div>
              <div className="col-md-3">
                <h6 className="text-muted">True Profit/Loss</h6>
                <p className={`fs-5 fw-bold ${totals.totalProfit >= 0 ? "text-success" : "text-danger"}`}>
                  Rs. {totals.totalProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicles Table */}
      {filteredVehicles.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Vehicle</th>
                <th>Brand & Model</th>
                <th>Customer Name</th>
                <th>Customer ID</th>
                <th>Sold Date</th>
                <th>Bought Price</th>
                <th>Maintenance Cost</th>
                <th>Sold Price</th>
                <th>True Profit/Loss</th>
                <th>Payment Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map(v => {
                const boughtPrice = v.finance?.boughtPrice || 0;
                const soldPrice = v.finance?.soldPrice || 0;
                const maintenanceCost = (v.finance?.maintenance || []).reduce((sum, m) => sum + (m.cost || 0), 0);
                const trueProfit = soldPrice - boughtPrice - maintenanceCost;
                const soldDate = v.finance?.soldDate ? new Date(v.finance.soldDate).toLocaleDateString("en-GB") : "-";

                return (
                  <tr key={v.id}>
                    <td>
                      <strong>{v.title}</strong>
                    </td>
                    <td>{v.details?.brand} {v.details?.model}</td>
                    <td>{v.finance?.invoice?.customerName || "-"}</td>
                    <td>{v.finance?.invoice?.customerId || "-"}</td>
                    <td>{soldDate}</td>
                    <td>Rs. {boughtPrice.toLocaleString()}</td>
                    <td className="text-warning fw-bold">Rs. {maintenanceCost.toLocaleString()}</td>
                    <td className="text-success fw-bold">Rs. {soldPrice.toLocaleString()}</td>
                    <td className={trueProfit >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                      Rs. {trueProfit.toLocaleString()}
                    </td>
                    <td>
                      <span className="badge bg-info">
                        {v.finance?.invoice?.payment?.type || "Unknown"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">
          No sold vehicles found for the selected period.
        </div>
      )}
    </div>
  );
}
