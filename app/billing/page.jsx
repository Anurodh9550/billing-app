"use client";

import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import { ToWords } from "to-words";



export default function BillingPage() {
  const billRef = useRef(null);
  const [party, setParty] = useState(null);

  const toWords = new ToWords({
    localeCode: 'en-IN',   // Indian format (Lakh, Crore)
    converterOptions: {
      currency: true,
      ignoreDecimal: true,
    },
  });

  const [items, setItems] = useState([
    {
      product: "",
      qty: 1,
      pack: "1X10",
      batch: "",
      exp: "",
      hsn: "",
      mrp: 0,
      rate: 0,
      discount: 0,
      sgstRate: 0,
      cgstRate: 0,
    },
  ]);

  /* SUMMARY GST */
  const [selectedGST, setSelectedGST] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("partyDetails");
    if (data) {
      setParty(JSON.parse(data));
    }
  }, []);
  if (!party) {
    return <p className="text-center mt-10">Loading party details...</p>;
  }
  const updateItem = (i, k, v) => {
    const updated = [...items];
    updated[i][k] = v;
    setItems(updated);
  };

  const addRow = () => {
    setItems([
      ...items,
      {
        product: "",
        qty: 1,
        pack: "1X10",
        rate: 0,
        discount: 0,
        sgstRate: 0,
        cgstRate: 0,
      },
    ]);
  };

  /* ================= CALCULATIONS ================= */
  const totalSGST = items.reduce((sum, i) => {
    const base = i.qty * i.rate;
    const disc = (base * i.discount) / 100;
    const afterDisc = base - disc;
    return sum + (afterDisc * i.sgstRate) / 100;
  }, 0);

  const totalCGST = items.reduce((sum, i) => {
    const base = i.qty * i.rate;
    const disc = (base * i.discount) / 100;
    const afterDisc = base - disc;
    return sum + (afterDisc * i.cgstRate) / 100;
  }, 0);

  // Subtotal AFTER item discount
  const subTotal = items.reduce((sum, i) => {
    const base = i.qty * i.rate;
    const disc = (base * i.discount) / 100;
    return sum + (base - disc);
  }, 0);

  // Apply ONLY selected GST
  const summarySGST =
    selectedGST > 0 ? (subTotal * selectedGST) / 200 : 0;

  const summaryCGST =
    selectedGST > 0 ? (subTotal * selectedGST) / 200 : 0;

  const grandTotal = subTotal + totalSGST + totalCGST;
  const gstSummary = [0, 5, 12, 18, 28].map(rate => {
    let sgst = 0;
    let cgst = 0;

    items.forEach(i => {
      const base = i.qty * i.rate;
      const disc = (base * i.discount) / 100;
      const taxable = base - disc;

      // SGST + CGST dono milke total GST = rate
      if (i.sgstRate + i.cgstRate === rate) {
        sgst += (taxable * i.sgstRate) / 100;
        cgst += (taxable * i.cgstRate) / 100;
      }
    });

    return {
      rate,
      sgst,
      cgst,
    };
  });


  /* ================= PRINT ================= */
  const handlePrint = () => {
    window.print();


  };





  /* ================= PDF ================= */

  /* ================= PDF ================= */



  return (
    <div className="flex justify-center bg-gray-100 py-4 print:bg-white print:py-0">
      <div className="w-full max-w-[210mm] bg-white shadow-lg print:shadow-none">

        {/* PRINT BUTTON */}
        <div className="fixed right-5 bottom-5 no-print">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-full border bg-white shadow font-bold"
          >
            🖨 Print / PDF
          </button>
        </div>

        {/* MAIN INVOICE BOX */}
        <div
          ref={billRef}
          className="invoice-print w-full border-[3px] border-black text-[11px] bg-white "

        >


          {/* HEADER */}
          <div className="grid grid-cols-2 border-b-[2px] border-black px-1 ">

            <div>
              <h1 className="font-black text-lg cambria-text">
                DETRA PROCESSING PRIVATE LTD
              </h1>

              <h1 className="text-sm font-bold">SHOP NO /PLOT NO.55 GROUND FLOOR, PATEL BAGH</h1>
              <h1 className="text-sm font-bold">COLONY, VIJAY NAGAR INDORE 23-MADHYA PRADESH</h1>
            </div>

            {party && (
              <div className="text-right">
                <h1 className="font-black text-lg cambria-text">{party.name}</h1>
                <h1 className="text-sm font-bold">{party.address}</h1>
                <h1 className="text-sm font-bold">GST NO : {party.gst}, D.L NO.:{party.dl}</h1>
              </div>
            )}
          </div>
          <div >
            <table className="w-full  border-t">
              <tbody>
                <tr>
                  {/* First Column (NO left border) */}
                  <td className="border-r border-black w-1/3 pl-2 text-sm font-bold">
                    <span>D.L.No.:-</span>21B/5974/12/2025
                    <br />
                    <span>GST:-</span>23AAKCD4698Q1ZS
                  </td>

                  {/* Middle Column (Left + Right border) */}
                  <td className="border-x border-black w-1/3 text-center  font-bold bg-gray-200">
                    <h1 className="font-bold text-lg">GST INVOICE</h1>
                    Time:{" "}
                    <b>
                      {new Date().toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </b>
                  </td>

                  {/* Last Column (NO right border) */}
                  <td className="border-l border-black w-1/3 text-center">
                    <div className="grid grid-cols-2 gap-x-4 text-sm font-bold">
                      <p className="text-left ">
                        Invoice No.: {party.Invoice}
                      </p>

                      <p className="text-right pr-2">
                        Date: {party.currentDate}
                      </p>

                      <p className="text-left">
                        Bill Type: {party.billType}
                      </p>

                      <p className="text-right -ml-5">
                        Due Date: {party.dueDate}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>

          {/* ITEMS TABLE */}
          <table className="w-full border-collapse border-b-[2px] border-black">
            <colgroup>
              <col style={{ width: "20px" }} />
              <col style={{ width: "50px" }} />
              <col style={{ width: "50px" }} />
              <col style={{ width: "220px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "50px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "30px" }} />
              <col style={{ width: "70px" }} />
              <col style={{ width: "60px" }} />
              <col style={{ width: "60px" }} />
              <col style={{ width: "70px" }} />
            </colgroup>

            <thead>
              <tr className="h-4">
                {[
                  "Sn",
                  "Qty",
                  "Pack",
                  "Product",
                  "Batch",
                  "Exp",
                  "HSN",
                  "MRP",
                  "Rate",
                  "Disc%",
                  "Aft Disc",
                  "SGST",
                  "CGST",
                  "Amount",
                ].map((h, index, arr) => (
                  <th
                    key={h}
                    className={`
          border-y-2  border-black  bg-gray-200
           text-sm font-semibold
          ${index !== 0 ? "border-l" : ""}
          ${index !== arr.length - 1 ? "border-r" : ""}
        `}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>


            <tbody className="leading-tight">
              {items.map((item, i) => {
                const base = item.qty * item.rate;
                const discAmt = (base * item.discount) / 100;
                const afterDisc = base - discAmt;
                const sgstAmt = (afterDisc * item.sgstRate) / 100;
                const cgstAmt = (afterDisc * item.cgstRate) / 100;
                const finalAmt = afterDisc + sgstAmt + cgstAmt;

                return (
                  <tr key={i} className="h-3">
                    {/* FIRST COLUMN (NO LEFT BORDER) */}
                    <td className="  text-center   text-sm font-semibold border-y border-black">
                      {i + 1}.
                    </td>

                    <td className=" text-sm font-semibold border-x border-black pr-1 border-y ">
                      <input
                        type="number"

                        value={item.qty}
                        onChange={(e) => updateItem(i, "qty", e.target.value)}
                        className="w-full  text-sm  text-center no-spinner"
                      />


                    </td>

                    <td className=" border-x  text-sm font-semibold border-y border-black pr-1">
                      <input
                        value={item.pack}
                        onChange={e => updateItem(i, "pack", e.target.value)}
                        className="w-full  text-sm"
                      />

                    </td>

                    <td className="border-y border-x border-black  text-sm font-semibold">
                      <input
                        value={item.product}
                        onChange={e => updateItem(i, "product", e.target.value)}
                        className="w-full "
                      />
                    </td>

                    <td className="border-y border-x border-black  text-sm font-semibold">
                      <input
                        value={item.batch}
                        onChange={e => updateItem(i, "batch", e.target.value)}
                        className="w-full   "
                      />
                    </td>

                    <td className="border-y border-x border-black">
                      <input
                        value={item.exp}
                        onChange={e => updateItem(i, "exp", e.target.value)}
                        className="w-full text-center   text-sm font-semibold"
                      />
                    </td>

                    <td className="border-y border-x border-black text-sm">
                      <input
                        value={item.hsn}
                        onChange={e => updateItem(i, "hsn", e.target.value)}
                        className="w-full text-sm font-semibold "
                      />
                    </td>

                    <td className="border-y border-x  border-black  text-sm    font-semibold">
                      <input
                        type="number"
                        step="0.01"
                        value={item.mrp}
                        onChange={e => updateItem(i, "mrp", +e.target.value)}
                        className="w-full text-center  no-spinner "
                      />
                    </td>

                    <td className="border-y border-x  border-black   text-sm font-semibold text-center">
                      <input
                        type="number"
                        step="0.01"
                        value={item.rate}
                        onChange={e => updateItem(i, "rate", e.target.value)}
                        className="w-full text-center text-sm  no-spinner"
                      />
                    </td>

                    <td className="border-y border-x  border-black text-center text-sm">
                      <input
                        type="number"
                        step="0.01"
                        value={item.discount}
                        onChange={e => updateItem(i, "discount", e.target.value)}
                        className="w-full text-center  text-sm font-semibold no-spinner"
                      />

                    </td>

                    <td className="border-y border-x border-black  text-sm font-semibold text-center text-sm">
                      {afterDisc.toFixed(2)}
                    </td>

                    <td className=" relative border-y border-x border-black text-sm text-right  text-sm font-semibold">
                      <select value={item.sgstRate}
                        onChange={e => updateItem(i, "sgstRate", +e.target.value)}
                        className="absolute inset-0  text-sm font-semibold opacity-0 cursor-pointer" >
                        {[0, 2.5, 6, 9, 14].map(v => (<option key={v} value={v}>
                          {v}%</option>))}
                      </select>
                      {sgstAmt.toFixed(2)}
                    </td>

                    <td className=" relative border-y   text-sm font-semibold border-x border-black text-right">
                      <select value={item.cgstRate}
                        onChange={e => updateItem(i, "cgstRate", +e.target.value)}
                        className="absolute inset-0 opacity-0   text-sm font-semibold cursor-pointer" >
                        {[0, 2.5, 6, 9, 14].map(v => (<option key={v} value={v}>
                          {v}%</option>))}
                      </select>
                      {cgstAmt.toFixed(2)}
                    </td>

                    {/* LAST COLUMN (NO RIGHT BORDER) */}
                    <td className="border-y border-l  text-sm font-semibold  border-black text-right pl-1">
                      {finalAmt.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
          <div className="border">
            <button
              onClick={addRow}
              className="  px-3 py-1 bg-blue-500 text-white"
            >
              + Add Row
            </button>
          </div>
          {/* SUMMARY */}
          <div className="grid grid-cols-2 border-black  ">
            <table className="w-full  border-collapse border border-black">
              <thead>
                <tr className="bg-gray-200  border-y-2  border-black -h-2 ">
                  <th className="border-r border-black text-sm font-semibold  ">Class</th>
                  <th className="border-r border-black text-sm font-semibold ">SGST</th>
                  <th className="border-r border-black  text-sm font-semibold ">CGST</th>
                  <th className=" border-r-2 border-black text-sm font-semibold  ">IGST</th>
                </tr>
              </thead>

              <tbody>
                {gstSummary.map(g => (
                  <tr key={g.rate} className="-h-1">
                    <td className="border-y border-black  text-sm font-semibold">
                      GST {g.rate}%
                    </td>

                    <td className="border-y border-black border-x  text-right text-sm font-semibold">
                      {g.sgst.toFixed(2)}
                    </td>

                    <td className="border-y border-black border-x  text-right text-sm font-semibold">
                      {g.cgst.toFixed(2)}
                    </td>

                    <td className="border-y border-r-[2px]  text-right border-black  text-sm font-semibold">
                      0.00
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>



            <div className="cambria-text   border-b border-t-[2px] border-black ">
              <div className="w-full text-sm">

                <div className="flex justify-between mr-3 text-sm font-semibold">
                  <span className="ml-3 ">Sub Total</span>
                  <span>{subTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mr-3 text-sm font-semibold">
                  <span className="ml-3">SGST</span>
                  <span>{totalSGST.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mr-3 text-sm font-semibold ">
                  <span className="ml-3 text-sm font-semibold ">CGST</span>
                  <span>{totalCGST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mr-3 text-sm font-semibold ">
                  <span className="ml-3">IGST</span>
                  <span>0.00</span>
                </div>
                <div className="flex justify-between mr-3  text-sm font-semibold">
                  <span className="ml-3">ADD/LESS</span>
                  <span>0.00</span>
                </div>
                <div className="flex justify-between mr-3 text-sm font-semibold ">
                  <span className="ml-3">CR/DR NOTE</span>
                  <span>0.00</span>
                </div>

                <div className="flex justify-between border-t-2 border-black mt-3 text-sm font-semibold pt-2 text-base">
                  <span>GRAND TOTAL</span>
                  <span className="mr-3"> {grandTotal.toFixed(2)}</span>
                </div>

              </div>


            </div>
          </div>
          <div className="border border-black cambria-text">




            <p className="text-sm  pl-3  font-semibold">Rs: <span> {toWords.convert(grandTotal)}</span>

            </p>


          </div>
          <div className="border-t border-black grid grid-cols-3 items-center cambria-text">

            {/* Column 1 */}
            <div className="border-r-2 border-black pl-3 text-smibold">
              <p className="underline font-bold">Terms & Conditions</p>
              <p>Goods once sold will not be taken back or exchanged</p>
              <p>Bill not paid due date will attract 24% interest.</p>
            </div>

            {/* Column 2 */}
            <div className="border-r-2 border-black flex items-end justify-center font-bold py-6">
              Reciver
            </div>

            {/* Column 3 */}
            <div className="flex items-end justify-center font-bold py-6">
              For  {party.name}
            </div>

          </div>


        </div>

      </div>

    </div>

  );
} 