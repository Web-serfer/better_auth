import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="text-center font-bold mt-10">
      <h1>Welcome {session.user.name}</h1>
      <p>Dashboard page</p>
    </div>
  );
};

export default DashboardPage;
