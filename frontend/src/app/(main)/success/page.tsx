import { auth } from "@/auth"

export default async function Success() {
  const session = await auth();

  const response = await fetch(`${process.env.API_BASE_URL}/api/indicators/secret`, {
    headers: { Authorization: `Bearer ${session?.accessToken}` },
  });

  const secret = await response.json();

  console.log(secret);

  if (!session) {
    return (
      <div className="min-h-[88.7vh] font-mono max-w-screen bg-red text-[#000] text-4xl flex flex-col">
        Nice try
      </div>
    );
  }

  return (
    <div className="min-h-[88.7vh] font-mono max-w-screen bg-green text-[#000] text-4xl flex flex-col">
      <p>{secret.message}</p>
      <pre className="text-wrap">{JSON.stringify(session, null, 2)}</pre>
      <p>{session ? JSON.stringify(session) : 'No session'}</p>
    </div>
  )
}