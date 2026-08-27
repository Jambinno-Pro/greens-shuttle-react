import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const quotesFile = path.join(__dirname, "../../data/quotes.json");

export const createQuote = (req, res) => {
  try {
    const { from, to, date, passengers, service } = req.body;

    if (!from || !to || !date || !passengers || !service) {
      return res.status(400).json({
        success: false,
        message: "Please complete all quote fields.",
      });
    }

    const quotes = JSON.parse(fs.readFileSync(quotesFile, "utf8"));

    const quote = {
      id: `QT-${Date.now()}`,
      type: "quote",
      from,
      to,
      date,
      passengers,
      service,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    quotes.push(quote);

    fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2));

    console.log("NEW QUOTE:", quote);

    res.status(201).json({
      success: true,
      message: "Quote request received successfully.",
      quote,
    });
  } catch (error) {
    console.error("Quote error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to process quote request.",
    });
  }
};
