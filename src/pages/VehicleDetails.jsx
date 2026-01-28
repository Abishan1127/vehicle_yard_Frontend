import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ImageGallery from "../components/ImageGallery";
import { loadVehicles } from "../store/vehicleStore";
import logoImage from "../assets/images/bird-colorful-gradient-design-vector_343694-2506.avif";

export default function VehicleDetails() {
  const { id } = useParams();
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    setVehicles(loadVehicles());
  }, []);

  const vehicle = useMemo(() => vehicles.find(v => v.id === id), [vehicles, id]);

  if (!vehicle) return <div className="text-muted">Vehicle not found.</div>;

  return (
    <div>
      <div className="mb-4 d-flex align-items-center gap-3">
        <img src={logoImage} alt="Logo" style={{ width: 50, height: 50, objectFit: "contain" }} />
        <div>
          <h4 className="m-0">VEHICLE YARD</h4>
          <small className="text-muted">Buy & Sell Quality Vehicles</small>
        </div>
        <div className="ms-auto">
          <Link to="/" className="btn btn-outline-secondary btn-sm">Back</Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <ImageGallery images={vehicle.images} height={320} />
        </div>

        <div className="col-12 col-lg-6">
          <h2>{vehicle.title}</h2>
          <div className="fs-4 fw-bold mb-2">Rs. {Number(vehicle.price).toLocaleString()}</div>
          <p className="text-muted">{vehicle.shortDesc}</p>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Details</h5>
              <ul className="list-unstyled m-0">
                <li><strong>Brand:</strong> {vehicle.details?.brand}</li>
                <li><strong>Model:</strong> {vehicle.details?.model}</li>
                <li><strong>Year:</strong> {vehicle.details?.year}</li>
                <li><strong>Mileage:</strong> {vehicle.details?.mileageKm?.toLocaleString()} km</li>
                <li><strong>Fuel:</strong> {vehicle.details?.fuel}</li>
                <li><strong>Transmission:</strong> {vehicle.details?.transmission}</li>
                <li><strong>Location:</strong> {vehicle.details?.location}</li>
                <li><strong>Chassis No:</strong> {vehicle.details?.chassisNo || "-"}</li>
                <li><strong>Engine No:</strong> {vehicle.details?.engineNo || "-"}</li>
                <li><strong>Registration No:</strong> {vehicle.details?.registrationNo || "-"}</li>
                <li><strong>Color:</strong> {vehicle.details?.color || "-"}</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
