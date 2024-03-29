"use client";

import React, { useEffect, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCookies } from "react-cookie";
import { useToast } from "@/components/ui/use-toast";
import useAdmin from "@/store/useAdmin";
import { Spin } from "antd";

const AdminNav = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const [openModal, setOpenModal] = useState(false);

  const [cookie, setCookies, removeCookie] = useCookies(["admintoken"]);
  const { toast } = useToast();

  const { admin, isAdmin, setAdmin, setIsAdmin, loading, setLoading } =
    useAdmin();

  const LogIn = async () => {
    setLoading(true);
    const { email, password } = userDetails;
    const response = await fetch("/api/admin/auth/login", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const response_data = await response.json();

    console.log(response_data);

    if (response_data.err) {
      setLoading(false);
      return alert(response_data.err);
    }

    console.log(response_data.data);
    setAdmin(response_data.data);
    setIsAdmin(true);

    toast({
      title: "Logged In",
      description: Date.now(),
    });
    setOpenModal(false);
    setLoading(false);
  };

  const JWTLogIn = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/auth", {
      credentials: "include"
    });

    const response_data = await response.json();

    if (response_data.err) {
      setOpenModal(true);
      setLoading(false);
      return;
    }

    console.log(response_data.data);
    setAdmin(response_data.data);
    setIsAdmin(true);
    toast({
      title: "Logged In",
      description: Date.now(),
    });
    setOpenModal(false);
    setLoading(false);
  };

  const LogOut = () => {
    setLoading(true);
    if (!isAdmin) {
      setOpenModal(true);
      setLoading(false);
      return;
    }
    removeCookie("admintoken");
    setIsAdmin(false);
    toast({
      title: "Logged Out",
      description: Date.now(),
    });
    setAdmin({ email: "", id: "", name: "" });
    setLoading(false);
  };

  useEffect(() => {
    if (!isAdmin) JWTLogIn();
    else setOpenModal(false);
  }, [isAdmin]);

  return (
    <div className="w-full flex px-6 py-3 justify-between items-center">
      <Spin spinning={loading} fullscreen />
      <div className="font-medium text-lg">InfinityGIF</div>
      <div className="flex gap-5 items-center justify-center">
        {isAdmin && (
          <div className="name font-medium text-lg">Hello {admin.name} !</div>
        )}
        <Button
          className={isAdmin ? "bg-orange-600" : "bg-green-600"}
          onClick={LogOut}
        >
          {isAdmin ? "LogOut" : "Login"}
        </Button>
      </div>
      {/* Login Signup Dialogs */}
      <Dialog open={openModal} onOpenChange={(e) => setOpenModal(e)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Login</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-3 p-5 items-center justify-center">
                <Input
                  value={userDetails.email}
                  placeholder="Email"
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                ></Input>
                <Input
                  value={userDetails.password}
                  placeholder="Password"
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      password: e.target.value,
                    })
                  }
                ></Input>
                <div className="forgot_password">
                  Forgot Password Don&apos;t Worry
                </div>
                <Button onClick={LogIn}>Login</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNav;
