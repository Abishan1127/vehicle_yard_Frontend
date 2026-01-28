const KEY = "vehicle_yard_invoice_no_v1";

export function getNextInvoiceNo() {
  const current = Number(localStorage.getItem(KEY) || "6421"); // start like your sample
  const next = current + 1;
  localStorage.setItem(KEY, String(next));
  return next;
}
