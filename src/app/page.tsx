"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Send, Github, Globe } from "lucide-react";
import Image from "next/image";
import "./globals.css";

export default function ChatApp() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", sender: "oreo" },
  ]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");

    const typingIndicator = { text: "Oreo is typing...", sender: "oreo" };
    setMessages((prev) => [...prev, typingIndicator]);

    try {
      const response = await fetch("https://backend-oreo.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, userId: "user-123" }),
      });
      const data = await response.json();

      setMessages((prev) => prev.filter((msg) => msg !== typingIndicator));
      setMessages((prev) => [...prev, { text: data.response, sender: "oreo" }]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } min-h-screen flex flex-col items-center p-4 transition-all`}
    >
      {/* Header */}
      <header
        className={`w-full max-w-lg flex justify-between items-center p-4 shadow-lg rounded-xl mb-4 border ${
          darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <Image
            src={darkMode ? "/logo-dark.png" : "/logo.png"}
            alt="Oreo AI"
            width={32}
            height={32}
          />
          <h1 className="text-xl font-bold">Oreo AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Volatile-Viv/oreo-web"
            target="_blank"
            className="hover:opacity-80"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://volatileviv.com"
            target="_blank"
            className="hover:opacity-80"
          >
            <Globe className="w-5 h-5" />
          </a>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full transition-all bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </header>

      {/* Chat Box */}
      <motion.div
        className={`w-full max-w-lg mt-5 p-6 rounded-2xl shadow-xl border relative ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-96 overflow-y-auto space-y-4 p-2">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              {msg.text}
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Box */}
        <div
          className={`flex items-center mt-4 border rounded-xl p-2 ${
            darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <input
            type="text"
            className={`flex-1 p-2 outline-none ${
              darkMode
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-gray-100 text-gray-900 placeholder-gray-600"
            }`}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="p-3 w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
