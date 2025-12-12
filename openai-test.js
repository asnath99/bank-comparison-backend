import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ta clé API doit être définie dans l'environnement
});

async function run() {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "user", content: "Donne-moi 3 bonnes pratiques pour sécuriser un backend Node.js" }
    ],
  });

  console.log(response.choices[0].message.content);
}

run();