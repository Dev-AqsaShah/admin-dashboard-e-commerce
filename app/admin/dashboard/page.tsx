
"use client";

import { client } from "@/sanity/lib/client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ProtectedRoute from "../../../Components/ProtectedRoute";

interface Order {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: number;
  address: string;
  zipCode: string;
  city: string;
  total: number;
  discount: number;
  orderDate: string;
  status: string | null;
  cartItems: { productName: string; image: string }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [isMounted, setIsMounted] = useState(false); // Fix hydration error

  useEffect(() => {
    setIsMounted(true); // Ensure component is mounted
  }, []);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id, firstName, lastName, phone, address, city, zipCode, discount, 
          total, orderDate, status, cartItems[]->{
            productName, image
          }
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.log("Error fetching orders", error));
  }, []);

  if (!isMounted) {
    return null; // Avoid hydration errors
  }

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "Order has been removed.", "success");
    } catch (error) {
      console.error("Error:", error); 
      Swal.fire("Error", "Failed to delete order", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      Swal.fire("Status Updated", `Order is now ${newStatus}`, "success");
    } catch (error) {
      console.error("Error:", error); 
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-blue-50">
        {/* Navbar */}
        <nav className="bg-blue-600 p-4 text-white shadow-md flex justify-between items-center">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex space-x-3">
            {["All", "Pending", "Success", "Dispatch"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status
                    ? "bg-white text-blue-800 font-bold"
                    : "text-white hover:bg-blue-700"
                }`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </nav>

        {/* Orders List */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-center text-blue-800">Orders</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-4">
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="cursor-pointer hover:bg-blue-100 transition-all"
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      <td className="p-3">{order._id}</td>
                      <td className="p-3">{order.firstName} {order.lastName}</td>
                      <td className="p-3">{order.address}</td>
                      <td className="p-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="p-3">${order.total}</td>
                      <td className="p-3">
                        <select
                          value={order.status || ""}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-gray-100 p-1 rounded border"
                        >
                          <option value="pending">Pending</option>
                          <option value="success">Success</option>
                          <option value="dispatch">Dispatched</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(order._id);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
