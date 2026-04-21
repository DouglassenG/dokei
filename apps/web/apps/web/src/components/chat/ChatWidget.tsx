"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: "900ms" }}
        />
      ))}
    </div>
  )
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Oi! Sou a Kauane, do Dokei.\nSe tiver dúvida sobre MEI, recibo, DAS ou qualquer coisa do app — é só falar. O que você precisa?",
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  async function revealParagraphs(fullReply: string) {
    const paragraphs = fullReply
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    for (let i = 0; i < paragraphs.length; i++) {
      // FIX 1: extrai em const tipada — elimina string | undefined em .length e no setMessages
      const paragrafo: string = paragraphs[i] ?? ""

      setIsTyping(true)

      const delay = Math.min(600 + paragrafo.length * 18, 2200)
      await new Promise((resolve) => setTimeout(resolve, delay))

      setIsTyping(false)

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: paragrafo },
      ])

      if (i < paragraphs.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300))
      }
    }
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || isLoading || isTyping) return

    const userMessage: Message = { role: "user", content: text }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()
      const reply = data.reply ?? "Não consegui processar. Tente novamente."

      setIsLoading(false)
      await revealParagraphs(reply)
    } catch {
      setIsLoading(false)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erro de conexão. Tenta de novo daqui a pouco.",
        },
      ])
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // FIX 2: restaura o split por \n — necessário para a WELCOME_MESSAGE e para qualquer
  // mensagem que tenha quebra de linha. Cada linha vira um <p> separado.
  // Consequência: mensagens normais do assistente (que chegam como parágrafo único via
  // revealParagraphs) renderizam um único <p> — comportamento idêntico ao anterior.
  function renderContent(text: string) {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return (
        <p key={i} className={i > 0 ? "mt-1" : ""}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part,
          )}
        </p>
      )
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir chat de suporte"
        className="cursor-pointer fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 max-h-[70vh]">
          <div className="bg-[#2E7D32] px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">
                Kauane
              </p>
              <p className="text-white/70 text-xs">Assistente Dokei • Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#2E7D32] text-white rounded-br-sm"
                      : "bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100"
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}

            {(isLoading || isTyping) && (
              <div className="flex justify-start">
                <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              rows={1}
              disabled={isLoading || isTyping}
              className="flex-1 resize-none text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 max-h-24 overflow-y-auto disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading || isTyping}
              className="w-9 h-9 bg-[#2E7D32] hover:bg-[#1B5E20] disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
