import React from "react";

import FilterForm from "@/components/sales/FilterForm";
import SupplierOrdersTable from "@/components/sales/SupplierOrdersTable";

const SupplierOrders = () => {
  return (
    <div>
      <FilterForm />
      <SupplierOrdersTable />
    </div>
  );
};

export default SupplierOrders;
