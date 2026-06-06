import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
  return (
    <div className="flex justify-center">
      <SignIn
        routing="hash"
        appearance={{
          variables: {
            colorPrimary: "#1B5E20",
            colorText: "#1a1a1a",
            borderRadius: "0.5rem",
          },
          elements: {
            rootBox: { width: "100%" },
            cardBox: {
              boxShadow: "none",
              border: "none",
              backgroundColor: "transparent",
            },
            card: {
              boxShadow: "none",
              backgroundColor: "transparent",
            },
            footer: {
              backgroundColor: "transparent",
            },
          },
        }}
      />
    </div>
  )
}
