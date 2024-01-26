import AdminNav from "@/components/adminComponents/AdminNav";
import Analytics from "@/components/adminComponents/Analytics";
import React from "react";

const Admin = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <AdminNav />
      <Analytics/>
    </div>
  );
};

export default Admin;
