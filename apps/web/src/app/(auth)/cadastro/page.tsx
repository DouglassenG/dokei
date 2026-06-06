import { SignUp } from "@clerk/nextjs"

export default function CadastroPage() {
  return (
    <div className="flex justify-center w-full">
      <SignUp
        routing="hash"
        appearance={{
          variables: {
            colorPrimary: "#1B5E20",
            colorText: "#1a1a1a",
            colorTextSecondary: "#666666",
            colorBackground: "#ffffff",
            borderRadius: "0.5rem",
            fontSize: "0.918rem",
          },
          elements: {
            rootBox: {
              width: "100%",
            },
            cardBox: {
              boxShadow: "none",
              border: "none",
              width: "100%",
            },
            card: {
              boxShadow: "none",
              padding: "0",
              width: "100%",
            },
            formFieldInput: {
              fontSize: "0.918rem",
              padding: "0.8rem 1rem",
            },
            formButtonPrimary: {
              fontSize: "0.918rem",
              padding: "0.8rem 1rem",
            },
            socialButtonsBlockButton: {
              fontSize: "0.918rem",
              padding: "0.75rem 1rem",
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
