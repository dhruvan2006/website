export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fff] text-[#191919] font-sans">
      {children}
    </div>
  )
}