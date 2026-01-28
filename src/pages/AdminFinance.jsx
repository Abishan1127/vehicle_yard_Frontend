import { useEffect, useMemo, useState } from "react";
import {
  aggregateProfit,
  getCostTotal,
  getMaintenanceTotal,
  getProfit,
  loadVehicles
} from "../store/vehicleStore";

export default function AdminFinance() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    setVehicles(loadVehicles());
  }, []);

  const soldVehicles = useMemo(
    () => vehicles.filter(v => v.status === "sold"),
    [vehicles]
  );

  const agg = useMemo(() => aggregateProfit(vehicles), [vehicles]);

  const monthlyRows = useMemo(() => {
    const keys = Object.keys(agg.monthly).sort().reverse();
    return keys.map(k => ({ key: k, profit: agg.monthly[k] }));
  }, [agg]);

  const yearlyRows = useMemo(() => {
    const keys = Object.keys(agg.yearly).sort().reverse();
    return keys.map(k => ({ key: k, profit: agg.yearly[k] }));
  }, [agg]);

  return (
    <div>
      <h3 className="mb-3">Finance Reports</h3>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Monthly Profit</h5>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th className="text-end">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyRows.map(r => (
                      <tr key={r.key}>
                        <td>{r.key}</td>
                        <td className="text-end">Rs. {Number(r.profit).toLocaleString()}</td>
                      </tr>
                    ))}
                    {!monthlyRows.length && (
                      <tr><td colSpan="2" className="text-muted">No sold vehicles yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Yearly Profit</h5>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th className="text-end">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyRows.map(r => (
                      <tr key={r.key}>
                        <td>{r.key}</td>
                        <td className="text-end">Rs. {Number(r.profit).toLocaleString()}</td>
                      </tr>
                    ))}
                    {!yearlyRows.length && (
                      <tr><td colSpan="2" className="text-muted">No sold vehicles yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Sold Vehicles Profit Breakdown</h5>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Vehicle</th>
                  <th>Sold Date</th>
                  <th className="text-end">Bought</th>
                  <th className="text-end">Maintenance</th>
                  <th className="text-end">Total Cost</th>
                  <th className="text-end">Sold</th>
                  <th className="text-end">Profit</th>
                </tr>
              </thead>
              <tbody>
                {soldVehicles.map(v => (
                  <tr key={v.id}>
                    <td className="fw-semibold">{v.title}</td>
                    <td>{v.finance?.soldDate || "-"}</td>
                    <td className="text-end">Rs. {Number(v.finance?.boughtPrice || 0).toLocaleString()}</td>
                    <td className="text-end">Rs. {Number(getMaintenanceTotal(v)).toLocaleString()}</td>
                    <td className="text-end">Rs. {Number(getCostTotal(v)).toLocaleString()}</td>
                    <td className="text-end">Rs. {Number(v.finance?.soldPrice || 0).toLocaleString()}</td>
                    <td className="text-end fw-bold">Rs. {Number(getProfit(v)).toLocaleString()}</td>
                  </tr>
                ))}
                {!soldVehicles.length && (
                  <tr><td colSpan="7" className="text-muted">No sold vehicles yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="text-muted small">
            Note: Profit is calculated only after sale: <strong>soldPrice - (boughtPrice + maintenanceTotal)</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
