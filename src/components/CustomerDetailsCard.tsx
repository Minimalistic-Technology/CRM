import React from 'react';
import { useCustomerStore } from '../store';

const CustomerDetailsCard: React.FC<{ customerId?: string }> = ({ customerId }) => {
  const { selectedCustomer, fetchCustomerById, loading, error } = useCustomerStore();

  React.useEffect(() => {
    if (customerId) fetchCustomerById(customerId);
  }, [customerId, fetchCustomerById]);

  if (loading) return <div aria-live="polite">Loading...</div>;
  if (error) return <div role="alert">Error: {error}</div>;
  if (!selectedCustomer) return <div>No customer selected</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/3" role="region" aria-labelledby="customer-details">
      <h2 id="customer-details" className="text-xl font-bold mb-4">Customer Details</h2>
      <p><strong>Name:</strong> {selectedCustomer.name}</p>
      <p><strong>Email:</strong> {selectedCustomer.contact.email}</p>
      <p><strong>Phone:</strong> {selectedCustomer.contact.phone}</p>
      <p><strong>Status:</strong> {selectedCustomer.status}</p>
      <p><strong>Last Activity:</strong> {selectedCustomer.lastActivity.toLocaleDateString()}</p>
    </div>
  );
};

export default CustomerDetailsCard;