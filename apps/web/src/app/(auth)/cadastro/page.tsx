import { SignUp } from "@clerk/nextjs"

export default function CadastroPage() {
  return (
    <div className="flex justify-center">
      <SignUp
        routing="hash"
        appearance={{
          variables: {
            colorPrimary: "#1B5E20",
            colorText: "#1a1a1a",
            colorTextSecondary: "#666666",
            colorBackground: "#ffffff",
            borderRadius: "0.5rem",
          },
          elements: {
            rootBox: { width: "100%" },
            cardBox: {
              boxShadow: "none",
              border: "none",
            },
            card: {
              boxShadow: "none",
            },
            footer: {
              backgroundColor: "white",
            },
          },
        }}
      />
    </div>
  )
}
