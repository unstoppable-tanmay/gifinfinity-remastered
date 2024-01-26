import Nav from "../../components/userComponents/Nav";
import Search from "@/components/userComponents/Search";
import Featured from "@/components/userComponents/Featured";

export default async function Home() {
  // const data = await fetch("http://localhost:3000/api/search", {
  //   credentials: "include",
  // });
  // console.log(data)
  return (
    <main className="w-screen min-h-screen flex items-center justify-start flex-col overflow-x-hidden">
      <Nav />
      <Search />
      <Featured />
    </main>
  );
}
