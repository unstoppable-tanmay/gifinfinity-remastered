import Nav from "../../components/userComponents/Nav";
import Search from "@/components/userComponents/Search";
import Featured from "@/components/userComponents/Featured";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-screen min-h-screen flex items-center justify-start flex-col overflow-x-hidden relative">
      <Nav />
      <Search />
      <Featured />
      <Link href={"/admin"}>
        <div className="go_to_admin w-full text-center py-3">
          <div className="text-sm font-semibold text-blue-500 ">
            Are You A Admin ?
          </div>
        </div>
      </Link>
    </main>
  );
}
