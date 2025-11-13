import React, { useEffect, useState } from "react";

export default function TenantAgreementList() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Mock Tenant JSON Data (replace with API later)
  const mockTenants = [
    {
      id: 1,
      name: "Amit Sharma",
      property: "Sunrise Apartment 102",
      rent: "₹15,000",
      leaseStart: "2024-01-01",
      leaseEnd: "2024-12-31",
    },
    {
      id: 2,
      name: "Priya Patel",
      property: "GreenVille Villa 8B",
      rent: "₹25,000",
      leaseStart: "2024-03-15",
      leaseEnd: "2025-03-14",
    },
    {
      id: 3,
      name: "Rahul Mehta",
      property: "Silver Heights 5A",
      rent: "₹18,500",
      leaseStart: "2024-05-01",
      leaseEnd: "2025-04-30",
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTenants(mockTenants);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 animate-pulse">Loading tenants...</p>
      </div>
    );

  if (!tenants.length)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">No tenants found.</p>
      </div>
    );

  return (
    <section className="w-full p-4 sm:p-6 bg-gray-50 rounded-2xl shadow">
      <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 text-center sm:text-left">
        Tenant Agreements
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow"
          >
            <p className="text-gray-800 font-medium text-lg mb-1">
              {tenant.name}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Property:</strong> {tenant.property}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Rent:</strong> {tenant.rent}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <strong>Lease:</strong> {tenant.leaseStart} → {tenant.leaseEnd}
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md transition-colors w-full sm:w-auto">
                View Agreement
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-md transition-colors w-full sm:w-auto">
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
