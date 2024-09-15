import { auth } from "@/auth"

export default async function Success() {
  const session = await auth();

  const response = await fetch(`${process.env.API_BASE_URL}/auth/user`, {
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  });

  const user = await response.json();

  console.log(user);

  // if (!user.email) {
  //   return (
  //   <div className="h-[88.7vh] font-mono max-w-screen bg-red text-[#fff] text-4xl flex flex-col items-center justify-center">
  //     <p>Fuck you</p>
  //   </div>
  //   )
  // }


  return (
    <div className="h-[88.7vh] font-mono max-w-screen bg-green text-[#fff] text-4xl flex flex-col items-center justify-center">
      <pre className="text-wrap">{JSON.stringify(session, null, 2)}</pre>
      {/* <p>{user.email ? user.email : "No email found"}</p> */}
    </div>
  )
}