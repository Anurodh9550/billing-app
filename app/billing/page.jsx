"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function BillingPage() {
  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
  });

  const [items, setItems] = useState([
    { name: "", qty: 1, rate: 0, gst: 5 },
  ]);

  const invoiceNo = "INV-" + Date.now();

  /* ================= ROW HANDLING ================= */
  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  const addRow = () => {
    setItems([...items, { name: "", qty: 1, rate: 0, gst: 5 }]);
  };

  /* ================= CALCULATIONS ================= */
  const totals = items.map((item) => {
    const base = item.qty * item.rate;
    const gstAmount = (base * item.gst) / 100;
    return {
      base,
      sgst: gstAmount / 2,
      cgst: gstAmount / 2,
      total: base + gstAmount,
    };
  });

  const subTotal = totals.reduce((a, b) => a + b.base, 0);
  const totalSGST = totals.reduce((a, b) => a + b.sgst, 0);
  const totalCGST = totals.reduce((a, b) => a + b.cgst, 0);
  const grandTotal = subTotal + totalSGST + totalCGST;

  /* ================= PRINT ================= */
  const printBill = () => window.print();

  /* ================= PDF ================= */
  const downloadPDF = async () => {
    const element = document.getElementById("invoice");
    const canvas = await html2canvas(element);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(img, "PNG", 10, 10, 190, 0);
    pdf.save(`${invoiceNo}.pdf`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div
        id="invoice"
        className="bg-white p-6 max-w-6xl mx-auto border"
      >
        {/* ================= HEADER ================= */}
        <div className="flex justify-between border-b pb-4 mb-4">
          <div>
            <h1 className="text-xl font-bold uppercase">
              My General Store
            </h1>
            <p className="text-sm">Address line, City, State</p>
            <p className="text-sm">GSTIN: 23ABCDE1234F1Z5</p>
            <p className="text-sm">Phone: 9876543210</p>
          </div>

          <div className="text-right text-sm">
            <h2 className="text-lg font-semibold">GST INVOICE</h2>
            <p>Invoice No: {invoiceNo}</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Time: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* ================= CUSTOMER ================= */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <label className="font-medium">Customer Name</label>
            <input
              className="w-full border px-2 py-1"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-medium">Customer Mobile</label>
            <input
              className="w-full border px-2 py-1"
              value={customer.mobile}
              onChange={(e) =>
                setCustomer({ ...customer, mobile: e.target.value })
              }
            />
          </div>
        </div>

        {/* ================= ITEM TABLE ================= */}
        <table className="w-full border text-sm mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">Sn</th>
              <th className="border p-1">Item Name</th>
              <th className="border p-1">Qty</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">GST %</th>
              <th className="border p-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td className="border p-1 text-center">{i + 1}</td>
                <td className="border p-1">
                  <input
                    className="w-full"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(i, "name", e.target.value)
                    }
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    className="w-full"
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(i, "qty", Number(e.target.value))
                    }
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    className="w-full"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(i, "rate", Number(e.target.value))
                    }
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    className="w-full"
                    value={item.gst}
                    onChange={(e) =>
                      updateItem(i, "gst", Number(e.target.value))
                    }
                  />
                </td>
                <td className="border p-1 text-right">
                  ₹ {totals[i].total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addRow}
          className="px-4 py-1 bg-blue-600 text-white text-sm mb-4"
        >
          + Add Item
        </button>

        {/* ================= TOTALS ================= */}
        <div className="grid grid-cols-2 mt-6 text-sm">
          <div />
          <div className="space-y-1">
            <p>Sub Total: ₹ {subTotal.toFixed(2)}</p>
            <p>SGST: ₹ {totalSGST.toFixed(2)}</p>
            <p>CGST: ₹ {totalCGST.toFixed(2)}</p>
            <p className="font-bold text-base border-t pt-1">
              Grand Total: ₹ {grandTotal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="mt-6 text-xs border-t pt-2">
          <p>Goods once sold will not be taken back.</p>
          <p>Subject to jurisdiction only.</p>
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={printBill}
          className="px-6 py-2 bg-gray-800 text-white rounded"
        >
          Print
        </button>
        <button
          onClick={downloadPDF}
          className="px-6 py-2 bg-green-600 text-white rounded"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
