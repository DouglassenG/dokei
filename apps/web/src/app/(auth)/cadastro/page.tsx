import { SignUp } from "@clerk/nextjs"

export default function CadastroPage() {
  return (
    <div className="flex justify-center">
      <SignUp
        routing="hash"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none w-full bg-transparent",
            headerTitle: "text-[#1B5E20]",
            headerSubtitle: "text-[#2E7D32]",
            formButtonPrimary:
              "bg-[#1B5E20] hover:bg-[#145214] text-white rounded-lg",
            footerActionLink: "text-[#1B5E20] hover:text-[#145214]",
            footer: "hidden",
          },
        }}
      />
    </div>
  )
}
