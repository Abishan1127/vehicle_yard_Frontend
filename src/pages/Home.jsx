import { useEffect, useMemo, useState } from "react";
import VehicleCard from "../components/VehicleCard";
import { loadVehicles } from "../store/vehicleStore";

const LOCATIONS = ["Jaffna", "Kilinochchi", "Vavuniya", "Batticaloa"];

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [q, setQ] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    setVehicles(loadVehicles());
  }, []);

  const available = useMemo(
    () => vehicles.filter(v => v.status === "available"),
    [vehicles]
  );

  const filtered = useMemo(() => {
    let result = available;

    // Filter by location if selected
    if (selectedLocation) {
      result = result.filter(v => v.details?.location === selectedLocation);
    }

    // Filter by search query
    const query = q.trim().toLowerCase();
    if (!query) return result;
    
    return result.filter(v =>
      (v.title || "").toLowerCase().includes(query) ||
      (v.shortDesc || "").toLowerCase().includes(query) ||
      (v.details?.brand || "").toLowerCase().includes(query) ||
      (v.details?.model || "").toLowerCase().includes(query)
    );
  }, [available, q, selectedLocation]);

  return (
    <div>
      <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between mb-5 mt-2 ">
        <h3 className="m-0">Available Vehicles</h3>
        <div className="d-flex gap-5 ">
          <select 
            className="form-control"
            style={{ maxWidth: 200 }}
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Select Locations </option>
            {LOCATIONS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <input
            className="form-control"
            style={{ minWidth: 320 }}
            placeholder="Search by name, brand, model..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-3">
        {filtered.map(v => <VehicleCard key={v.id} vehicle={v} />)}
        {!filtered.length && (
          <div className="text-muted">No vehicles found.</div>
        )}
      </div>
    </div>
  );
}
