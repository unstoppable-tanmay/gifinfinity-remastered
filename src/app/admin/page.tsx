'use client'

import AdminNav from "@/components/adminComponents/AdminNav";
import Analytics from "@/components/adminComponents/Analytics";
import Link from "next/link";
import React from "react";

const Admin = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <AdminNav />
      <Analytics />
      <Link href={"/"}>
        <div className="back_to_user w-full text-center py-3">
          <div className="text-sm font-semibold text-blue-500 ">
            Back To User Mode
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Admin;
