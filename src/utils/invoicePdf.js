import jsPDF from "jspdf";
import logoImage from "../assets/images/bird-colorful-gradient-design-vector_343694-2506.avif";

export function generateInvoicePdf({ invoiceNo, dateStr, customerName, customerId, payment }, vehicle) {
  const doc = new jsPDF();

  // Page setup
  let y = 12;

  // Logo and Header
  doc.addImage(logoImage, "JPEG", 14, y - 5, 30, 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("VEHICLE YARD", 80, y + 5);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Invoice", 80, y + 12);

  // Date and Invoice number - aligned to right
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Date: ${dateStr}`, 150, y + 5, { align: "right" });
  doc.text(`Invoice No: ${invoiceNo}`, 150, y + 12, { align: "right" });

  y += 40;

  // Separator line
  doc.setDrawColor(0);
  doc.line(14, y, 196, y);
  y += 5;

  // Body fields (based on your PDF)
  const rows = [
    ["Make", vehicle.details?.brand || "-"],
    ["Model", vehicle.details?.model || "-"],
    ["Chassis No", vehicle.details?.chassisNo || "-"],
    ["Engine No", vehicle.details?.engineNo || "-"],
    ["Registration No", vehicle.details?.registrationNo || "-"],
    ["Color", vehicle.details?.color || "-"],
    ["Year Of Manufacture", String(vehicle.details?.year || "-")],
    ["Amount", `Rs. ${String(payment.salePrice || 0)}`],
    ["To be Delivered", customerName || "-"],
    ["ID No", customerId || "-"],
  ];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Vehicle Details", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), 55, y);
    y += 7;
  });

  // Payment breakdown
  y += 4;
  doc.line(14, y, 196, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Payment Summary", 14, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Payment Type: ${payment.type}`, 14, y); y += 6;

  if (payment.type === "Cash") {
    doc.text(`Paid Amount: Rs. ${payment.salePrice}`, 14, y); y += 6;
  } else {
    // Leasing
    doc.text(`Sale Price: Rs. ${payment.salePrice}`, 14, y); y += 6;
    doc.text(`Down Payment: Rs. ${payment.downPayment || 0}`, 14, y); y += 6;
    doc.text(`Leasing Amount: Rs. ${payment.leasingAmount || 0}`, 14, y); y += 6;
    if (payment.notes) {
      doc.text(`Notes: ${payment.notes}`, 14, y); y += 6;
    }
  }

  // Conditions section
  y += 8;
  doc.line(14, y, 196, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Terms & Conditions", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const conditions = [
    "• Cash payment is non-refundable.",
    "• All vehicles sold as-is with no warranty.",
    "• Customer responsible for vehicle inspection before purchase.",
    "• Title transfer completes upon full payment."
  ];

  conditions.forEach(condition => {
    doc.text(condition, 14, y);
    y += 5;
  });

  // Signature section
  y += 8;
  doc.line(14, y, 196, y);
  y += 8;

  // Two columns for signatures
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  // Seller signature
  doc.line(14, y + 20, 50, y + 20);
  doc.text("Seller Signature", 14, y + 24);

  // Customer signature
  doc.line(130, y + 20, 196, y + 20);
  doc.text("Customer Signature", 130, y + 24);

  doc.text(customerName || "___________________", 130, y + 8, { maxWidth: 70 });

  // Download
  doc.save(`Invoice_${invoiceNo}_${vehicle.id}.pdf`);
}
