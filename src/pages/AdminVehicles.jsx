import { useEffect, useMemo, useState } from "react";
import { loadVehicles, saveVehicles, uid } from "../store/vehicleStore";
import { getNextInvoiceNo } from "../store/invoiceNumber";
import { generateInvoicePdf } from "../utils/invoicePdf";

const LOCATIONS = ["Jaffna", "Kilinochchi", "Vavuniya", "Batticaloa"];

const emptyForm = {
  title: "",
  price: "",
  shortDesc: "",
  coverImage: "",
  brand: "",
  model: "",
  year: "",
  mileageKm: "",
  fuel: "",
  transmission: "",
  location: "",
  chassisNo: "",
  engineNo: "",
  registrationNo: "",
  color: "",
  boughtPrice: "",
  boughtDate: "",
};

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Image management
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  // Maintenance cost fields
  const [maintenance, setMaintenance] = useState([]);
  const [maintenanceCost, setMaintenanceCost] = useState("");
  const [maintenanceNote, setMaintenanceNote] = useState("");
  const [maintenanceDate, setMaintenanceDate] = useState("");

  // Sale modal-like fields (simple inline)
  const [sellId, setSellId] = useState(null);
  const [soldPrice, setSoldPrice] = useState("");
  const [soldDate, setSoldDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState("");

  const [paymentType, setPaymentType] = useState("Cash"); // Cash | Leasing
  const [downPayment, setDownPayment] = useState("");
  const [leasingAmount, setLeasingAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  useEffect(() => {
    setVehicles(loadVehicles());
  }, []);

  function persist(next) {
    setVehicles(next);
    saveVehicles(next);
  }

  const editingVehicle = useMemo(
    () => vehicles.find(v => v.id === editingId),
    [vehicles, editingId]
  );

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setImages([]);
    setImageUrl("");
    setMaintenance([]);
    setMaintenanceCost("");
    setMaintenanceNote("");
    setMaintenanceDate("");
  }

  function startEdit(v) {
    setEditingId(v.id);
    setForm({
      title: v.title || "",
      price: v.price ?? "",
      shortDesc: v.shortDesc || "",
      coverImage: v.coverImage || "",
      brand: v.details?.brand || "",
      model: v.details?.model || "",
      year: v.details?.year ?? "",
      mileageKm: v.details?.mileageKm ?? "",
      fuel: v.details?.fuel || "",
      transmission: v.details?.transmission || "",
      location: v.details?.location || "",
      boughtPrice: v.finance?.boughtPrice ?? "",
      boughtDate: v.finance?.boughtDate || "",
    });
    setImages(v.images || []);
    setImageUrl("");
    setMaintenance(v.finance?.maintenance || []);
    setMaintenanceCost("");
    setMaintenanceNote("");
    setMaintenanceDate("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function upsertVehicle(e) {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please add at least one image");
      return;
    }

    const base = {
      title: form.title.trim(),
      price: Number(form.price) || 0,
      shortDesc: form.shortDesc.trim(),
      status: "available",
      coverImage: form.coverImage.trim(),
      images: images,
      details: {
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: Number(form.year) || "",
        mileageKm: Number(form.mileageKm) || 0,
        fuel: form.fuel.trim(),
        transmission: form.transmission.trim(),
        location: form.location.trim(),
        chassisNo: form.chassisNo.trim(),
        engineNo: form.engineNo.trim(),
        registrationNo: form.registrationNo.trim(),
        color: form.color.trim(),
      },
      finance: {
        boughtPrice: Number(form.boughtPrice) || 0,
        boughtDate: form.boughtDate || null,
        maintenance: maintenance,
        soldPrice: editingVehicle?.finance?.soldPrice || null,
        soldDate: editingVehicle?.finance?.soldDate || null,
      }
    };

    if (!editingId) {
      const created = { ...base, id: uid("veh") };
      persist([created, ...vehicles]);
      resetForm();
      return;
    }

    const next = vehicles.map(v => {
      if (v.id !== editingId) return v;
      // Keep current status (available/sold)
      return { ...base, id: v.id, status: v.status };
    });

    persist(next);
    resetForm();
  }

  function deleteVehicle(id) {
    const next = vehicles.filter(v => v.id !== id);
    persist(next);
    if (editingId === id) resetForm();
  }

  function addMaintenance() {
    if (!maintenanceCost || !maintenanceDate) {
      alert("Please enter cost and date");
      return;
    }
    const newMaintenance = {
      id: uid("maint"),
      cost: Number(maintenanceCost) || 0,
      note: maintenanceNote.trim(),
      date: maintenanceDate,
    };
    setMaintenance([...maintenance, newMaintenance]);
    setMaintenanceCost("");
    setMaintenanceNote("");
    setMaintenanceDate("");
  }

  function removeMaintenance(id) {
    setMaintenance(maintenance.filter(m => m.id !== id));
  }

  function addImage() {
    if (!imageUrl.trim()) {
      alert("Please enter image URL or select a file");
      return;
    }
    if (images.length >= 8) {
      alert("Maximum 8 images allowed");
      return;
    }
    setImages([...images, imageUrl.trim()]);
    setImageUrl("");
  }

  function handleImageFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 8) {
      alert("Maximum 8 images allowed");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === "string") {
        setImages([...images, dataUrl]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleCoverImageFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === "string") {
        setForm(prev => ({ ...prev, coverImage: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function removeImage(idx) {
    setImages(images.filter((_, i) => i !== idx));
  }

  const totalMaintenanceCost = useMemo(
    () => maintenance.reduce((sum, m) => sum + (m.cost || 0), 0),
    [maintenance]
  );

function beginSell(v) {
  setSellId(v.id);
  setSoldPrice(String(v.finance?.soldPrice ?? v.price ?? ""));
  setSoldDate(new Date().toISOString().slice(0, 10));
  setCustomerName("");
  setCustomerId("");

  setPaymentType("Cash");
  setDownPayment("");
  setLeasingAmount("");
  setPaymentNotes("");
}
function generateInvoiceAndSell() {
  if (!sellId) return;

  // Validate all required customer details
  if (!customerName.trim()) {
    alert("Please fill in customer name");
    return;
  }
  if (!customerId.trim()) {
    alert("Please fill in customer ID");
    return;
  }
  if (!soldDate) {
    alert("Please fill in sold date");
    return;
  }
  if (!soldPrice) {
    alert("Please fill in sale price");
    return;
  }

  // Validate payment details for Leasing
  if (paymentType === "Leasing") {
    if (!downPayment) {
      alert("Please fill in down payment");
      return;
    }
    if (!leasingAmount) {
      alert("Please fill in leasing amount");
      return;
    }
  }

  const vehicle = vehicles.find(v => v.id === sellId);
  if (!vehicle) return;

  const invoiceNo = getNextInvoiceNo();
  const dateStr = new Date().toLocaleDateString("en-GB"); // similar to 24.01.2026 style

  const payment = {
    type: paymentType,
    salePrice: Number(soldPrice) || 0,
    downPayment: Number(downPayment) || 0,
    leasingAmount: Number(leasingAmount) || 0,
    notes: paymentNotes.trim(),
  };

  // 1) Generate PDF (download)
  generateInvoicePdf(
    {
      invoiceNo,
      dateStr,
      customerName: customerName.trim(),
      customerId: customerId.trim(),
      payment,
    },
    vehicle
  );

  // 2) Update vehicle as SOLD (and finance values for profit report)
  const next = vehicles.map(v => {
    if (v.id !== sellId) return v;
    return {
      ...v,
      status: "sold",
      finance: {
        ...(v.finance || {}),
        soldPrice: Number(soldPrice) || 0,
        soldDate: soldDate || new Date().toISOString().slice(0, 10),
        invoice: {
          invoiceNo,
          customerName: customerName.trim(),
          customerId: customerId.trim(),
          payment
        }
      }
    };
  });

  persist(next);

  // close panel
  setSellId(null);
}


  function confirmSell() {
    if (!sellId) return;

    const next = vehicles.map(v => {
      if (v.id !== sellId) return v;
      return {
        ...v,
        status: "sold",
        finance: {
          ...(v.finance || {}),
          soldPrice: Number(soldPrice) || 0,
          soldDate: soldDate || new Date().toISOString().slice(0, 10),
        }
      };
    });

    persist(next);
    setSellId(null);
    setSoldPrice("");
    setSoldDate("");
  }

  return (
    <div>
      <h3 className="mb-3">Manage Vehicles</h3>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editingId ? "Edit Vehicle" : "Add Vehicle"}</h5>

          <form className="row g-3" onSubmit={upsertVehicle}>
            <div className="col-12 col-md-6">
              <label className="form-label">Title</label>
              <input name="title" className="form-control" value={form.title} onChange={onChange} required />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label">Public Price (Selling)</label>
              <input name="price" type="number" className="form-control" value={form.price} onChange={onChange} required />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label">Bought Price</label>
              <input name="boughtPrice" type="number" className="form-control" value={form.boughtPrice} onChange={onChange} required />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Bought Date</label>
              <input name="boughtDate" type="date" className="form-control" value={form.boughtDate} onChange={onChange} required />
            </div>

            <div className="col-12 col-md-8">
              <label className="form-label">Short Description</label>
              <input name="shortDesc" className="form-control" value={form.shortDesc} onChange={onChange} required />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Cover Image</label>
              <div className="d-flex gap-2">
                <input 
                  type="file"
                  className="form-control" 
                  accept="image/*"
                  onChange={handleCoverImageFileUpload}
                />
              </div>
              {form.coverImage && (
                <div className="mt-2">
                  <img 
                    src={form.coverImage} 
                    alt="Cover"
                    style={{ width: "100%", height: 120, objectFit: "cover" }}
                    className="rounded"
                  />
                </div>
              )}
            </div>

            <div className="col-12 col-md-12">
              <label className="form-label">Other Images ({images.length}/8)</label>
              <div className="d-flex gap-2 mb-2">
                <input 
                  type="file"
                  className="form-control" 
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  disabled={images.length >= 8}
                />
                <span className="text-muted small" style={{ whiteSpace: "nowrap", paddingTop: "6px" }}>Or</span>
                <input 
                  type="text"
                  className="form-control" 
                  placeholder="Enter image URL"
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <button 
                  type="button"
                  className="btn btn-outline-primary" 
                  onClick={addImage}
                  disabled={images.length >= 8}
                >
                  Add URL
                </button>
              </div>
              
              {images.length > 0 && (
                <div className="alert alert-light p-2">
                  <div className="row g-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="col-6 col-md-3">
                        <div className="position-relative">
                          <img 
                            src={img} 
                            alt={`Image ${idx + 1}`}
                            style={{ width: "100%", height: 100, objectFit: "cover" }}
                            className="rounded"
                          />
                          <button 
                            type="button"
                            className="btn btn-sm btn-outline-danger position-absolute top-0 end-0"
                            onClick={() => removeImage(idx)}
                            style={{ marginTop: -8, marginRight: -8 }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label">Brand</label>
              <input name="brand" className="form-control" value={form.brand} onChange={onChange} required />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label">Model</label>
              <input name="model" className="form-control" value={form.model} onChange={onChange} required />
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label">Year</label>
              <input name="year" type="number" className="form-control" value={form.year} onChange={onChange} required />
            </div>

            <div className="col-6 col-md-4">
              <label className="form-label">Mileage (km)</label>
              <input name="mileageKm" type="number" className="form-control" value={form.mileageKm} onChange={onChange} required />
            </div>

            <div className="col-6 col-md-4">
              <label className="form-label">Fuel</label>
              <input name="fuel" className="form-control" value={form.fuel} onChange={onChange} required />
            </div>

            <div className="col-6 col-md-4">
              <label className="form-label">Transmission</label>
              <input name="transmission" className="form-control" value={form.transmission} onChange={onChange} required />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Location</label>
              <select name="location" className="form-control" value={form.location} onChange={onChange} required>
                <option value="">-- Select Location --</option>
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label">Chassis No</label>
              <input name="chassisNo" className="form-control" value={form.chassisNo} onChange={onChange} required />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label">Engine No</label>
              <input name="engineNo" className="form-control" value={form.engineNo} onChange={onChange} required />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label">Registration No</label>
              <input name="registrationNo" className="form-control" value={form.registrationNo} onChange={onChange} required />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label">Color</label>
              <input name="color" className="form-control" value={form.color} onChange={onChange} required />
            </div>

            <div className="col-12 pt-3">
              <hr />
              <h6 className="mb-3">Maintenance Costs</h6>
              
              {editingId && (
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-4">
                    <label className="form-label">Maintenance Date</label>
                    <input 
                      type="date"
                      className="form-control" 
                      value={maintenanceDate} 
                      onChange={(e) => setMaintenanceDate(e.target.value)} 
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label">Cost (Rs.)</label>
                    <input 
                      type="number"
                      className="form-control" 
                      value={maintenanceCost} 
                      onChange={(e) => setMaintenanceCost(e.target.value)} 
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label">Note</label>
                    <input 
                      type="text"
                      className="form-control" 
                      placeholder="e.g., Full service, Oil change"
                      value={maintenanceNote} 
                      onChange={(e) => setMaintenanceNote(e.target.value)} 
                    />
                  </div>

                  <div className="col-12">
                    <button 
                      type="button"
                      className="btn btn-outline-secondary btn-sm" 
                      onClick={addMaintenance}
                    >
                      + Add Maintenance Cost
                    </button>
                  </div>
                </div>
              )}

              {maintenance.length > 0 && (
                <div className="mb-3">
                  <div className="alert alert-light p-2">
                    <div className="small">
                      {maintenance.map(m => (
                        <div key={m.id} className="d-flex justify-content-between align-items-center mb-2">
                          <span>
                            <strong>{new Date(m.date).toLocaleDateString()}</strong> - Rs. {Number(m.cost).toLocaleString()}
                            {m.note && <span className="text-muted"> ({m.note})</span>}
                          </span>
                          <button 
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeMaintenance(m.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="border-top pt-2 mt-2">
                      <strong>Total Maintenance Cost: Rs. {totalMaintenanceCost.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                {editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Sell panel */}
      {sellId && (
  <div className="card border-warning mb-3">
    <div className="card-body">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
        <div>
          <h5 className="m-0">Sold Details + Invoice</h5>
          <div className="text-muted small">Fill customer and payment, then generate invoice PDF.</div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={generateInvoiceAndSell}>
            Generate Invoice PDF & Mark Sold
          </button>
          <button className="btn btn-outline-secondary" onClick={() => setSellId(null)}>
            Cancel
          </button>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12 col-md-4">
          <label className="form-label">Customer Name</label>
          <input className="form-control" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Customer ID No</label>
          <input className="form-control" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Sold Date</label>
          <input className="form-control" type="date" value={soldDate} onChange={(e) => setSoldDate(e.target.value)} required />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Sale Price (Vehicle Amount)</label>
          <input className="form-control" type="number" value={soldPrice} onChange={(e) => setSoldPrice(e.target.value)} required />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Payment Type</label>
          <select className="form-select" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
            <option value="Cash">Cash</option>
            <option value="Leasing">Leasing</option>
          </select>
        </div>

        {paymentType === "Leasing" && (
          <>
            <div className="col-12 col-md-4">
              <label className="form-label">Down Payment</label>
              <input className="form-control" type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} required />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Leasing Amount</label>
              <input className="form-control" type="number" value={leasingAmount} onChange={(e) => setLeasingAmount(e.target.value)} required />
            </div>

            <div className="col-12 col-md-8">
              <label className="form-label">Notes (optional)</label>
              <input className="form-control" value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} />
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)}


      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ minWidth: 220 }}>Vehicle</th>
              <th>Status</th>
              <th>Public Price</th>
              <th>Bought Price</th>
              <th style={{ minWidth: 220 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.id}>
                <td>
                  <div className="d-flex gap-2 align-items-center">
                    <img src={v.coverImage} alt={v.title} style={{ width: 60, height: 40, objectFit: "cover" }} className="rounded" />
                    <div>
                      <div className="fw-semibold">{v.title}</div>
                      <div className="text-muted small">{v.details?.brand} {v.details?.model} • {v.details?.year}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${v.status === "sold" ? "text-bg-secondary" : "text-bg-success"}`}>
                    {v.status}
                  </span>
                </td>
                <td>Rs. {Number(v.price || 0).toLocaleString()}</td>
                <td>Rs. {Number(v.finance?.boughtPrice || 0).toLocaleString()}</td>
                <td className="d-flex flex-wrap gap-2">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => startEdit(v)}>Edit</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => deleteVehicle(v.id)}>Delete</button>
                  {v.status !== "sold" && (
                    <button className="btn btn-success btn-sm" onClick={() => beginSell(v)}>Mark Sold</button>
                  )}
                </td>
              </tr>
            ))}
            {!vehicles.length && (
              <tr><td colSpan="5" className="text-muted">No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
