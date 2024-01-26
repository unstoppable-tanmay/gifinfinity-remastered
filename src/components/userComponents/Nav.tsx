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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCookies } from "react-cookie";
import { useToast } from "@/components/ui/use-toast";
import GifCard from "./GifCard";
import { Pagination } from "antd";

const Nav = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [loginModal, setLoginModal] = useState(true);
  const [likedModal, setLikedModal] = useState(false);
  const [page, setPage] = useState(1);

  const {
    isUser,
    loading,
    setIsUser,
    setLoading,
    setUser,
    user,
    setLikedGifs,
    liked_gifs,
  } = useUser();

  const [cookie, setCookies, removeCookie] = useCookies(["token"]);
  const { toast } = useToast();

  const SignUp = async () => {
    const { name, email, password } = userDetails;
    const response = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const response_data = await response.json();

    if (!response_data.data) return alert(response_data.error);

    console.log(response_data.data);
    setUser(response_data.data);
    setIsUser(true);
    toast({
      title: "Signed Up",
      description: Date.now(),
    });
    setOpenModal(false);
  };

  const LogIn = async () => {
    const { email, password } = userDetails;
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const response_data = await response.json();

    if (response_data.err) return alert(response_data.err);

    setUser(response_data.data);
    setIsUser(true);

    setLikedGifs(response_data.liked_gifs);

    toast({
      title: "Logged In",
      description: Date.now(),
    });
    setOpenModal(false);
  };

  const JWTLogIn = async () => {
    const response = await fetch("http://localhost:3000/api/auth");

    const response_data = await response.json();

    if (response_data.err) return;

    console.log(response_data);
    setUser(response_data.data);
    setIsUser(true);

    setLikedGifs(response_data.liked_gifs);

    toast({
      title: "Logged In",
      description: Date.now(),
    });
    setOpenModal(false);
  };

  const LogOut = () => {
    removeCookie("token");
    setIsUser(false);
    toast({
      title: "Logged Out",
      description: Date.now(),
    });
    setUser({ email: "", featured: [], id: "", liked: [], name: "" });
    setLikedGifs([]);
  };

  useEffect(() => {
    if (!isUser) JWTLogIn();
  }, [isUser]);

  return (
    <div className="w-full flex px-6 py-3 justify-between items-center">
      <div className="font-medium text-lg">InfinityGIF</div>
      {isUser ? (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Hello {user.name} !!</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={(e) => setLikedModal(true)}>
                Liked Items <MenubarShortcut>❤</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem className="text-orange-700" onClick={LogOut}>
                Log Out{" "}
                <MenubarShortcut className="text-orange-700">▶</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
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
      {/* Login Signup Dialogs */}
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
                  <Button onClick={LogIn}>Login</Button>
                  <div className="change">
                    Want To{" "}
                    <span
                      className="text-blue-500 cursor-pointer"
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
                  <Button onClick={SignUp}>Sign Up</Button>
                  <div className="change">
                    Want To{" "}
                    <span
                      className="text-blue-500 cursor-pointer"
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

      {/* Liked Items Dialogs */}
      <Dialog open={likedModal} onOpenChange={(e) => setLikedModal(e)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Liked Gifs</DialogTitle>
            <DialogDescription className="max-h-[70vh] overflow-y-scroll">
              {liked_gifs && liked_gifs.length ? (
                <div className="gif_container_wrapper flex flex-col w-full items-center justify-center">
                  <div className="gif_container flex flex-wrap w-full justify-center gap-5 max-w-[90vw] p-5">
                    {liked_gifs &&
                      liked_gifs
                        .slice(page * 10 - 10, page * 10)
                        .map((gif, ind: number) => {
                          console.log(gif);
                          return <GifCard key={ind} string_gif={gif.gif} />;
                        })}
                  </div>
                  <Pagination
                    defaultCurrent={page}
                    pageSize={10}
                    onChange={(e) => {
                      setPage(e);
                    }}
                    total={liked_gifs.length}
                  />
                </div>
              ) : (
                <></>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Nav;
