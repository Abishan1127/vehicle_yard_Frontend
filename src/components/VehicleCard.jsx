import { Link } from "react-router-dom";

export default function VehicleCard({ vehicle }) {
  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="card h-100 shadow-sm">
        <img
          src={vehicle.coverImage}
          className="card-img-top"
          alt={vehicle.title}
          style={{ height: 200, objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{vehicle.title}</h5>
          <p className="card-text text-muted mb-2">{vehicle.shortDesc}</p>
          
          {vehicle.details?.location && (
            <p className="card-text mb-2">
              <small className="badge bg-info">{vehicle.details.location}</small>
            </p>
          )}

          <div className="mt-auto d-flex justify-content-between align-items-center">
            <div className="fw-bold">Rs. {Number(vehicle.price).toLocaleString()}</div>
            <Link className="btn btn-outline-primary btn-sm" to={`/vehicle/${vehicle.id}`}>
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
