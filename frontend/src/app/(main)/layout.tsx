import Navbar from "../components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mt-[4.5rem]">
      <Navbar />
      {children}
    </div>
  )
}