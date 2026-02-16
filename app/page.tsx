import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Billing Software</h1>
        <p className="text-gray-600 mb-6">
          GST Billing System for General Shop
        </p>
        <Link
          href="/party"
          className="px-6 py-3 bg-blue-600 text-white rounded"
        >
          Go to Billing
        </Link>
      </div>
    </div>
  );
}
