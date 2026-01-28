import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="row g-4">
      <div className="col-12 col-lg-3">
        <div className="list-group">
          <NavLink to="/admin/vehicles" className="list-group-item list-group-item-action">
            Manage Vehicles
          </NavLink>
          <NavLink to="/admin/finance" className="list-group-item list-group-item-action">
            Finance Reports
          </NavLink>
        </div>
      </div>

      <div className="col-12 col-lg-9">
        <Outlet />
      </div>
    </div>
  );
}
