import axios from "axios";

export const generateCatDescription = async (
  catInfo: Record<string, any>
): Promise<string | null> => {
  const groqQuery = `
    Oled abivalmis assistent, kes loob kassi kirjeldusi.
    Loo mulle detailne ja sõbralik kirjeldus järgmise kassi kohta. Anna maksimaalselt 3 lõiku.
    
    Nimi: ${catInfo.name || "N/A"}
    Sugu: ${catInfo.gender || "N/A"}
    Kassi värv: ${catInfo.color || "N/A"}
    Sünniaeg: ${catInfo.dateOfBirth || "N/A"}
    Päästmiskp: ${catInfo.rescueDate || "N/A"}
    Karvapikkus: ${catInfo.furLength || "N/A"}
    Iseloomu omadused: ${(catInfo.personality || []).join(", ") || "N/A"}
    Kassile meeldib: ${(catInfo.likes || []).join(", ") || "N/A"}
    Muud omadused: ${(catInfo.otherTraits || []).join(", ") || "N/A"}
    Igapäeva rutiin: ${catInfo.dailyRoutine || "N/A"}
    Kroonilised haigused: ${catInfo.chronicIllnesses || "N/A"}
    Erivajadused:  ${catInfo.specialNeeds || "N/A"}
    Suhtumine teistesse kassidesse: ${catInfo.interactionWithCats || "N/A"}
    Suhtumine teistesse koertesse: ${catInfo.interactionWithDogs || "N/A"}
    Suhtumine lastesse: ${catInfo.interactionWithChildren || "N/A"}
    Sobiv keskkond: ${catInfo.type || "N/A"}
    Muud märkmed: ${catInfo.additionalNotes || "N/A"}
    
  `;

  return generateText(groqQuery);
};

export const generateText = async (query: string): Promise<string | null> => {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.warn(
        "Warning: API key is missing. AI generation is unavailable."
      );
      return null;
    }

    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates cat descriptions.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    };

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (
      !response.data ||
      !response.data.choices ||
      response.data.choices.length === 0
    ) {
      console.warn("Warning: AI API returned an empty response.");
      return null;
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating text:", error);
    return null;
  }
};
