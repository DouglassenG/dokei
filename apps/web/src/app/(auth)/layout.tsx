export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">dokei</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão simples para MEI</p>
        </div>
        {children}
      </div>
    </div>
  )
}
