import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center">
      <h3>Page not found</h3>
      <Link to="/" className="btn btn-primary mt-2">Go Home</Link>
    </div>
  );
}
