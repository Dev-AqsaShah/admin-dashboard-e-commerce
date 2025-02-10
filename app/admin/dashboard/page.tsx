"use client";

import { client } from "@/sanity/lib/client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ProtectedRoute from "../../components/protected/page";

interface Order {
  _id: string;
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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id,
          firstName,
          lastName,
          phone,
          address,
          city,
          zipCode,
          discount,
          total,
          orderDate,
          status,
          cartItems[]->{
            productName,
            image
          }
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.log("Error fetching orders", error));
  }, []);

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You would not be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it."
    });
    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "The order has been deleted.", "success");
    } catch (error) {
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

      if (newStatus === "dispatch") {
        Swal.fire("Order Dispatched", "Your order has been dispatched", "success");
      } else if (newStatus === "success") {
        Swal.fire("Success", "Your order has been completed", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to change status", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-100">
        <nav className="bg-red-600 p-4 text-white shadow-lg flex justify-between">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex space-x-4 mt-2">
            {["All", "Pending", "Success", "Dispatch"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status ? "bg-white text-red-600 font-bold" : "text-white"
                }`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </nav>

<div className="flex-1 p-6 overflow-auto">
  <h2 className="text-2xl font-bold text-center">
    Orders
  </h2>
  <div className="overflow-y-auto bg-white rounded-lg shadow-sm">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Address</th>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {filteredOrders.map((order) => (
          <React.Fragment key={order._id}>
            <tr className="cursor-pointer hover:bg-red-100 transition-all" onClick={() => toggleOrderDetails(order._id)}>
              <td>{order._id}</td>
              <td>{order.firstName} {order.lastName} </td>
              <td>{order.address} </td>
              <td>{new Date(order.orderDate).toLocaleDateString()} </td>
              <td></td>
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
