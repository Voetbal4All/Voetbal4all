import json
import os
from datetime import datetime, timezone

from openai import OpenAI

# OpenAI client (verwacht OPENAI_API_KEY in environment)
client = OpenAI()

# Waar news.json staat in je repo
NEWS_PATH = os.path.join("data", "news.json")


def build_prompt():
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return f"""
Je bent een sportjournalist die kort, helder en aantrekkelijk voetbalnieuws schrijft in het Nederlands.

Maak een JSON-array met 10 nieuwsartikels in deze exacte structuur:

[
  {{
    "id": "news-1",
    "title": "Korte, krachtige titel (max 80 tekens)",
    "teaser": "Korte samenvatting in 1 tot 3 zinnen.",
    "competition": "jpl | eredivisie | challenger | keuken | nat-be | nat-nl | laag-be | laag-nl | rode-duivels | oranje | transfers | internationaal",
    "competitionLabel": "Jupiler Pro League | Eredivisie | Challenger Pro League | Keuken Kampioen Divisie | Nationale reeksen België | Nationale reeksen Nederland | Lagere klassen België | Lagere klassen Nederland | Rode Duivels | Oranje | Transfernieuws | Internationaal nieuws",
    "gender": "heren of dames",
    "type": "speeldag | voorbeschouwing | nabeschouwing | transfer | internationaal",
    "imagePrompt": "Korte beschrijving van een AI-afbeelding die bij het artikel past.",
    "imageAlt": "Korte alt-tekst voor de afbeelding.",
    "createdAt": "{today}T00:00:00Z"
  }}
]

Richtlijnen:
- Schrijf ALLES in het Nederlands.
- Verdeel de artikels over:
  - Jupiler Pro League
  - Eredivisie
  - Challenger Pro League
  - Keuken Kampioen Divisie
  - Rode Duivels
  - Oranje
  - Transfernieuws
  - Internationaal nieuws
- Mix dames en heren waar logisch.
- Geen uitleg rond de JSON, enkel de JSON-array als output.
    """.strip()


def generate_news():
    prompt = build_prompt()

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "Je bent een nauwkeurige voetbalredacteur die geldige JSON produceert."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
    )

    content = response.choices[0].message.content.strip()

    # Proberen de JSON te parsen
    try:
        data = json.loads(content)
    except json.JSONDecodeError:
        # In geval van extra tekst rond de JSON, probeer de eerste '[' en laatste ']' te isoleren
        start = content.find('[')
        end = content.rfind(']')
        if start != -1 and end != -1:
            snippet = content[start : end + 1]
            data = json.loads(snippet)
        else:
            raise

    if not isinstance(data, list):
        raise ValueError("OpenAI output is geen JSON-array.")

    # Zorg dat ids uniek en netjes oplopend zijn
    for i, item in enumerate(data, start=1):
        item["id"] = f"news-{i}"

    return data


def main():
    os.makedirs(os.path.dirname(NEWS_PATH), exist_ok=True)
    news = generate_news()

    with open(NEWS_PATH, "w", encoding="utf-8") as f:
        json.dump(news, f, ensure_ascii=False, indent=2)

    print(f"Nieuw(s) geschreven naar {NEWS_PATH} ({len(news)} artikels).")


if __name__ == "__main__":
    main()
