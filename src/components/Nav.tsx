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
import useUser from "@/store/useUser";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Nav = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [loginModal, setLoginModal] = useState(true);

  const { isUser, loading, setIsUser, setLoading, setUser, user } = useUser();

  const SignUp = async () => {
    const { name, email, password } = userDetails;
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const response_data = await response.json();

    if (response_data.err) return alert(response_data.err);

    console.log(response_data.data);
    setUser(response_data.data);
    setIsUser(true);
  };

  const LogIn = async () => {
    const { name, email } = userDetails;
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    const response_data = await response.json();

    if (response_data.err) return alert(response_data.err);

    console.log(response_data.data);
    setUser(response_data.data);
    setIsUser(true);
  };

  const JWTLogIn = async () => {
    const response = await fetch("/api/auth");

    const response_data = await response.json();

    if (response_data.err) return;

    console.log(response_data.data);
    setUser(response_data.data);
    setIsUser(true);
  };

  useEffect(() => {
    JWTLogIn();
  }, []);

  return (
    <div className="w-full flex px-6 py-3 justify-between items-center">
      <div className="font-medium text-lg">InfinityGIF</div>
      {isUser ? (
        <>{user.name}</>
      ) : (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Profile</MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={(e) => {
                  setLoginModal(true);
                  setOpenModal(true);
                }}
              >
                Log In
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={(e) => {
                  setLoginModal(false);
                  setOpenModal(true);
                }}
              >
                Sign up
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )}
      <Dialog open={openModal} onOpenChange={(e) => setOpenModal(e)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              {loginModal ? "Log In" : "Sign Up"}
            </DialogTitle>
            <DialogDescription>
              {loginModal ? (
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
                  <Button>Login</Button>
                  <div className="change">
                    Want To{" "}
                    <span
                      className="text-blue-500"
                      onClick={(e) => setLoginModal(false)}
                    >
                      Sign Up
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 p-5 items-center justify-center">
                  <Input
                    value={userDetails.name}
                    placeholder="Name"
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, name: e.target.value })
                    }
                  ></Input>
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
                  <Button>Login</Button>
                  <div className="change">
                    Want To{" "}
                    <span
                      className="text-blue-500"
                      onClick={(e) => setLoginModal(true)}
                    >
                      Log In
                    </span>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Nav;
