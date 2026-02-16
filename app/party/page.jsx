"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PartyPage() {
  const router = useRouter();

  const [party, setParty] = useState({
    name: "",
    address: "",
    gst: "",
    dl: "",
    city: "",
    billType: "CREDIT",
    dueDate: "",
    currentDate: "",
    Invoice: "",
    eSign: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParty({
      ...party,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNext = () => {
    if (!party.eSign) {
      alert("Please accept e-sign / declaration");
      return;
    }
    localStorage.setItem("partyDetails", JSON.stringify(party));
    router.push("/billing");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8 md:p-12 print:shadow-none">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-indigo-700">
            🏥 Party / Medical Details
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Fill customer or medical store information
          </p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

          {/* Medical Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Medical / Agency Name
            </label>
            <input
              name="name"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50
              focus:bg-white focus:outline-none focus:ring-2
              focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              City / State
            </label>
            <input
              name="city"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50
              focus:bg-white focus:outline-none focus:ring-2
              focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* GST */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              GST Number
            </label>
            <input
              name="gst"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50
              focus:bg-white focus:outline-none focus:ring-2
              focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* DL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Drug License (DL No)
            </label>
            <input
              name="dl"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50
              focus:bg-white focus:outline-none focus:ring-2
              focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              rows={3}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50
              focus:bg-white focus:outline-none focus:ring-2
              focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* Bill Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Bill Type
            </label>
            <select
              name="billType"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50
              focus:bg-white focus:outline-none focus:ring-2
              focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            >
              <option value="CREDIT">CREDIT</option>
              <option value="CASH">CASH</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50
              focus:bg-white focus:outline-none focus:ring-2
              focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* Current Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Current Date
            </label>
            <input
              type="date"
              name="currentDate"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50
              focus:bg-white focus:outline-none focus:ring-2
              focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>

          {/* Invoice */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Invoice No
            </label>
            <input
              name="Invoice"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50
              focus:bg-white focus:outline-none focus:ring-2
              focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>
        </div>

        {/* E-Sign */}
        <div className="flex gap-3 mt-10 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-pink-50 border">
          <input
            type="checkbox"
            name="eSign"
            checked={party.eSign}
            onChange={handleChange}
            className="accent-indigo-600 mt-1"
          />
          <p className="text-xs text-gray-600">
            I hereby confirm that the above details are correct and authorize this invoice electronically.
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-end mt-10 print:hidden">
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-xl text-white font-semibold
            bg-gradient-to-r from-indigo-600 to-pink-600
            hover:scale-105 transition shadow-lg"
          >
            Continue to Billing →
          </button>
        </div>

      </div>
    </div>
  );
}
