"use client"

import { useEffect, useState, useRef } from "react"
import axios from "../config/axios"
import { Send, Bot, User, Loader2 } from "lucide-react"

const GeminiChat = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messageBox = useRef(null)
  const textareaRef = useRef(null)

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return

    // Add user message to the chat
    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Send the message to the backend
      const response = await axios.get(`/ai/get-result?prompt=${encodeURIComponent(inputMessage)}`)
      
      // Extract the JSON content from the markdown code block
      const jsonMatch = response.data.match(/```json\n([\s\S]*?)\n```/)
      const jsonContent = jsonMatch ? jsonMatch[1] : response.data
      const responseData = JSON.parse(jsonContent)
      
      // Add AI response to the chat
      const aiMessage = {
        role: "assistant",
        content: responseData.text,
        timestamp: new Date().toISOString(),
      }
      
      
      setMessages((prevMessages) => [...prevMessages, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      
      // Add error message to the chat
      const errorMessage = {
        role: "system",
        content: "Sorry, there was an error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      }
      
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [inputMessage])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight
    }
  }, [messages])

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <section className="relative flex flex-col h-[90vh] w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        <header className="flex items-center p-4 border-b w-full bg-gradient-to-r from-violet-600 to-indigo-600 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-full">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Gemini AI Chat</h1>
          </div>
          <div className="ml-auto flex items-center">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400 mr-2"></span>
            <span className="text-xs font-medium text-white/80">Online</span>
          </div>
        </header>

        <div className="conversation-area flex-grow flex flex-col h-full relative">
          <div
            className="message-box flex-grow flex flex-col gap-4 p-6 overflow-auto max-h-[calc(90vh-8rem)] break-words"
            ref={messageBox}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-violet-600" />
                </div>
                <p className="text-xl font-medium mb-2">Welcome to Gemini AI Chat!</p>
                <p className="text-slate-400 text-center max-w-md">
                  Ask me anything about general knowledge, creative writing, coding help, or just chat with me.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-md">
                  {["Tell me a joke", "Write a short poem", "Explain quantum computing", "Help with JavaScript"].map(
                    (suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInputMessage(suggestion)
                          if (textareaRef.current) {
                            textareaRef.current.focus()
                          }
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-700 transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    ),
                  )}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message max-w-[80%] animate-fadeIn ${msg.role === "user" ? "ml-auto" : "mr-auto"}`}
                >
                  <div className="flex items-start gap-3">
                    {msg.role !== "user" && (
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-violet-600" />
                      </div>
                    )}
                    <div
                      className={`flex flex-col p-3 rounded-2xl shadow-sm ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : msg.role === "assistant"
                            ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                            : "bg-red-50 border border-red-100 text-red-800"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                      {console.log(msg)}
                    
                      <small
                        className={`text-xs mt-1 self-end ${msg.role === "user" ? "text-indigo-200" : "text-slate-400"}`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </small>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4 text-indigo-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="message max-w-[80%] mr-auto">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-violet-600" />
                  </div>
                  <div className="flex flex-col p-4 rounded-2xl shadow-sm bg-white border border-slate-200 text-slate-800 rounded-tl-none">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="input-field flex w-full p-4 bg-white border-t absolute bottom-0">
            <div className="relative flex-grow">
              <textarea
                ref={textareaRef}
                placeholder="Type a message..."
                className="w-full p-3 pr-12 border border-slate-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none min-h-[44px] max-h-[150px]"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows="1"
              />
              {inputMessage.trim() === "" && (
                <div className="absolute right-3 top-3 text-xs text-slate-400">Press Enter to send</div>
              )}
            </div>
            <button
              onClick={sendMessage}
              disabled={isLoading || inputMessage.trim() === ""}
              className="send-button p-3 px-6 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default GeminiChat
