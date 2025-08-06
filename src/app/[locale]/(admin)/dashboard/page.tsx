import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import AllWalletLogs from "@/components/dashboard/AllWalletLogs";
import ShopConnect from "@/components/dashboard/ShopConnect";
import UsersTable from "@/components/dashboard/UsersTable";
// import SyncOrders from "@/components/SyncOrders";
// import { SyncButton } from "@/components/SyncStores";
import WarehouseCreateForm from "@/components/warehouse/WarehouseCreateForm";
import WarehouseTable from "@/components/warehouse/WarehouseTable";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="p-8 text-text">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p>Mağaza Bağlama</p>
      <ShopConnect />
      <br />
      <p>Ara Depo Oluştur</p>
      <WarehouseCreateForm />
      <br />
      <WarehouseTable />

      {/* <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sync</h2>
        <SyncButton />
        <SyncOrders />
      </div> */}
      <UsersTable />
      <AllWalletLogs />
    </div>
  );
}
