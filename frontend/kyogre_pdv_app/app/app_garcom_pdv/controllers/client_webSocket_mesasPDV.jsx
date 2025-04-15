import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";


const SUPABASE_URL = "https://szxghxqynfooieeiymfx.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGdoeHF5bmZvb2llZWl5bWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzExNDMsImV4cCI6MjA1Njk0NzE0M30.D5LvCtnWhAaGkzFCQPzTpirBYZB3hEkqk0cH1L-zTF8"


const supabase = createClient(
  SUPABASE_URL, // substitua
  SUPABASE_KEY
);

function useRealtimeMesas() {
  const [mensagens, setMensagens] = useState([]);

  useEffect(() => {
    const channel = supabase.channel("teste-canal");

    channel
      .on("broadcast", { event: "novo_evento" }, (payload) => {
        console.log("📡 Mensagem recebida:", payload);
        setMensagens((prev) => [...prev, payload.payload.mensagem]);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Subscrito ao canal com sucesso");
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return mensagens;
}

export default function PainelMesas() {
    const mensagens = useRealtimeMesas();
  
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold">📡 Realtime Supabase!</h2>
        <ul>
          {mensagens.map((msg, idx) => (
            <li key={idx} className="text-green-500">→ {msg}</li>
          ))}
        </ul>
      </div>
    );
  }