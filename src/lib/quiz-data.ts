import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import {
  Heart,
  Home,
  Sun,
  Smile,
  Users,
  User,
  ThumbsUp,
  Award,
  BookOpen,
  Coffee,
  Car,
  Gift,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Shield,
  Sprout,
  Moon,
  Drama,
  Anchor,
  Key,
  Flame,
  BrainCircuit,
  Puzzle,
  Plane
} from 'lucide-react';

export type MCQuestion = {
  id: number;
  topic: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  selfQuestion: { de: string; en: string };
  guessQuestion: { de: string; en: string };
  options: { de: string; en: string }[];
  relationships: string[]; // e.g. ['Liebespaar', 'Verheiratet', 'Frisch verliebt']
};

const mapRelationships = (categories: string[]): string[] => {
    const mapping: { [key: string]: string } = {
        'Dating': 'Frisch verliebt',
        'Liebespaar': 'Liebespaar',
        'Ehepaar': 'Verheiratet',
        'Beste Freunde': 'Beste Freunde',
        'Freunde': 'Beste Freunde',
        'Arbeitskollegen': 'Arbeitskollegen',
        'Geschäftspartner': 'Arbeitskollegen',
    };
    const mapped = categories.map(cat => mapping[cat] || null).filter(Boolean) as string[];
    // Use 'Frisch verliebt' for 'Dating' to match UI options, but keep 'Dating' for filtering logic
    const final = categories.map(cat => cat === 'Dating' ? 'Dating' : (mapping[cat] || null)).filter(Boolean) as string[];
    return [...new Set(final)];
}

const rawQuestions: {
  q_de: string;
  q_en: string;
  o_de: string[];
  o_en: string[];
  c: string[];
}[] = [
  {
    q_de: 'Wie fühlst du dich am schnellsten verbunden?',
    q_en: 'How do you feel connected the fastest?',
    o_de: ['Durch Lachen', 'Durch Tiefe Gespräche', 'Durch gemeinsame Aktivität', 'Durch ruhige Nähe'],
    o_en: ['Through laughter', 'Through deep conversations', 'Through a shared activity', 'Through quiet closeness'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Beste Freunde', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Was ist dein perfekter Feierabend?',
    q_en: 'What is your perfect evening after work?',
    o_de: ['Sport und Dusche', 'Essen kochen und reden', 'Draußen spazieren', 'Ruhe und Musik'],
    o_en: ['Sports and a shower', 'Cooking and talking', 'A walk outside', 'Quiet and music'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Freunde', 'Arbeitskollegen']
  },
  {
    q_de: 'Du kaufst dir ein Eis und es fällt herunter. Was denkst du zuerst?',
    q_en: 'You buy an ice cream and it falls. What is your first thought?',
    o_de: ['Pech gehabt, weiter', 'Kurz ärgern, dann lachen', 'Neuer Versuch, neues Eis', 'Zeichen für etwas anderes'],
    o_en: ['Too bad, move on', 'Get annoyed briefly, then laugh', 'New try, new ice cream', 'A sign for something else'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Freunde', 'Arbeitskollegen']
  },
  {
    q_de: 'Du siehst einen Straßenhund vor dem Supermarkt. Was machst du?',
    q_en: 'You see a stray dog in front of the supermarket. What do you do?',
    o_de: ['Essen und Wasser holen', 'Personal fragen, ob Hilfe möglich', 'Rescue-Kontakt suchen', 'Weitergehen und später spenden'],
    o_en: ['Get food and water', 'Ask staff if help is possible', 'Look for a rescue contact', 'Walk on and donate later'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Freunde', 'Arbeitskollegen']
  },
  {
    q_de: 'Welche Art Kompliment trifft dich wirklich?',
    q_en: 'What kind of compliment really gets to you?',
    o_de: ['Du hast das stark gelöst', 'Ich mag, wie du denkst', 'Du machst andere sicher', 'Du bringst Leichtigkeit'],
    o_en: ["You solved that strongly", "I like how you think", "You make others feel safe", "You bring lightness"],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Beste Freunde', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Wie reagierst du, wenn etwas schiefgeht?',
    q_en: 'How do you react when something goes wrong?',
    o_de: ['Ruhig Optionen sammeln', 'Kurz fluchen, dann handeln', 'Brauche erst Pause', 'Mache daraus ein Abenteuer'],
    o_en: ['Calmly gather options', 'Swear briefly, then act', 'Need a break first', 'Turn it into an adventure'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Freunde', 'Arbeitskollegen']
  },
  {
    q_de: 'Welche Kleinigkeit zeigt dir Respekt?',
    q_en: 'What little thing shows you respect?',
    o_de: ['Pünktlichkeit', 'Zuhören ohne Handy', 'Klare Absprachen', 'Freundlicher Ton'],
    o_en: ['Punctuality', 'Listening without a phone', 'Clear agreements', 'A friendly tone'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Was ist für dich ein guter erster Eindruck?',
    q_en: 'What makes a good first impression for you?',
    o_de: ['Warm und offen', 'Kompetent und klar', 'Humor und Lockerheit', 'Ruhig und präsent'],
    o_en: ['Warm and open', 'Competent and clear', 'Humor and ease', 'Calm and present'],
    c: ['Dating', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Wie triffst du Entscheidungen?',
    q_en: 'How do you make decisions?',
    o_de: ['Bauchgefühl', 'Daten und Fakten', 'Gespräch und Abgleich', 'Zeit und Schlaf drüber'],
    o_en: ['Gut feeling', 'Data and facts', 'Discussion and alignment', 'Time and sleeping on it'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Welche Art Überraschung magst du?',
    q_en: 'What kind of surprise do you like?',
    o_de: ['Kleine spontane Geste', 'Geplantes Erlebnis', 'Praktische Hilfe', 'Schöne Worte'],
    o_en: ['A small spontaneous gesture', 'A planned experience', 'Practical help', 'Kind words'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Beste Freunde']
  },
  {
    q_de: 'Wenn du müde bist, was hilft dir am meisten?',
    q_en: 'When you are tired, what helps you the most?',
    o_de: ['Kurz allein sein', 'Umarmung & Nähe', 'Essen, Wasser, Pause', 'Motivation & Humor'],
    o_en: ['Being alone for a bit', 'A hug & closeness', 'Food, water, a break', 'Motivation & humor'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Beste Freunde']
  },
  {
    q_de: 'Was ist dein Lieblingsort für ein gutes Gespräch?',
    q_en: 'What is your favorite place for a good conversation?',
    o_de: ['Spaziergang draußen', 'Café, Menschen beobachten', 'Auto-/Motorradfahrt', 'Zuhause auf dem Sofa'],
    o_en: ['A walk outside', 'A café, people watching', 'A drive in a car/motorcycle', 'At home on the sofa'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Beste Freunde', 'Arbeitskollegen']
  },
  {
    q_de: 'Wie zeigst du Anerkennung am liebsten?',
    q_en: 'How do you prefer to show appreciation?',
    o_de: ['Konkretes Lob', 'Helfen und mitziehen', 'Kleine Überraschung', 'Zuhören, Details merken'],
    o_en: ['Specific praise', 'Helping and joining in', 'A small surprise', 'Listening, remembering details'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Welche Regel macht jedes Gespräch besser?',
    q_en: 'What rule makes every conversation better?',
    o_de: ['Erst verstehen, dann reagieren', 'Keine Unterbrechungen', 'Nachfragen statt raten', 'Kurze, klare Sätze'],
    o_en: ['Understand first, then react', 'No interruptions', 'Ask instead of guessing', 'Short, clear sentences'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Wie gehst du mit Kritik um?',
    q_en: 'How do you handle criticism?',
    o_de: ['Ich will Beispiele', 'Ich brauche Zeit', 'Ich frage nach Lösung', 'Ich nehme es sofort an'],
    o_en: ['I want examples', 'I need time', 'I ask for a solution', 'I accept it immediately'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Was macht dich sofort sympathisch an jemandem?',
    q_en: 'What makes you immediately like someone?',
    o_de: ['Echte Neugier', 'Respektvoller Humor', 'Souveräne Ruhe', 'Großzügigkeit'],
    o_en: ['Genuine curiosity', 'Respectful humor', 'Confident calmness', 'Generosity'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Welche Energie bringst du in eine Gruppe?',
    q_en: 'What energy do you bring to a group?',
    o_de: ['Ich führe und entscheide', 'Ich beruhige und ordne', 'Ich motiviere und lache', 'Ich beobachte und gebe Tiefe'],
    o_en: ['I lead and decide', 'I calm and organize', 'I motivate and laugh', 'I observe and provide depth'],
    c: ['Arbeitskollegen', 'Geschäftspartner', 'Freunde', 'Dating']
  },
  {
    q_de: 'Wenn du Stress hast, was brauchst du von anderen?',
    q_en: 'When you are stressed, what do you need from others?',
    o_de: ['Klare Prioritäten', 'Einfach Verständnis', 'Praktische Hilfe', 'Humor und Pause'],
    o_en: ['Clear priorities', 'Simple understanding', 'Practical help', 'Humor and a break'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Welche Art Wochenende lädt dich auf?',
    q_en: 'What kind of weekend recharges you?',
    o_de: ['Natur, Bewegung, Sonne', 'Stadt, Kultur, Essen', 'Zuhause, Reset, Ordnung', 'Spontan, ohne Plan'],
    o_en: ['Nature, movement, sun', 'City, culture, food', 'Home, reset, order', 'Spontaneous, without a plan'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Freunde']
  },
  {
    q_de: 'Welche kleine Sache würdest du heute feiern?',
    q_en: 'What little thing would you celebrate today?',
    o_de: ['Dass wir Zeit haben', 'Dass wir gesund sind', 'Dass wir Fortschritt machen', 'Dass wir lachen können'],
    o_en: ["That we have time", "That we are healthy", "That we are making progress", "That we can laugh"],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Was ist dein idealer erster Valentinstag zusammen?',
    q_en: 'What is your ideal first Valentine\'s Day together?',
    o_de: ['Leicht, spielerisch', 'Romantisch, klassisch', 'Abenteuer und raus', 'Zuhause, intim'],
    o_en: ['Light, playful', 'Romantic, classic', 'Adventure and out', 'At home, intimate'],
    c: ['Dating']
  },
  {
    q_de: 'Was ist für dich ein perfektes erstes Date?',
    q_en: 'What is a perfect first date for you?',
    o_de: ['Café und Spazieren', 'Aktivität wie Arcade', 'Kochen zusammen', 'Sonnenuntergang, Natur'],
    o_en: ['Coffee and a walk', 'An activity like an arcade', 'Cooking together', 'Sunset, nature'],
    c: ['Dating']
  },
  {
    q_de: 'Wie flirtet man mit dir am besten?',
    q_en: 'What is the best way to flirt with you?',
    o_de: ['Direkt, ehrlich', 'Neckend, witzig', 'Mit Komplimenten', 'Mit Taten'],
    o_en: ['Direct, honest', 'Teasing, witty', 'With compliments', 'With actions'],
    c: ['Dating']
  },
  {
    q_de: 'Welche Nachricht macht dich sofort neugierig?',
    q_en: 'What message makes you immediately curious?',
    o_de: ['Frage mit Tiefe', 'Witzige Beobachtung', 'Konkreter Date-Vorschlag', 'Sprachnachricht'],
    o_en: ['A question with depth', 'A witty observation', 'A concrete date proposal', 'A voice message'],
    c: ['Dating']
  },
  {
    q_de: 'Wie schnell möchtest du dich treffen, statt zu schreiben?',
    q_en: 'How soon do you want to meet instead of texting?',
    o_de: ['Sofort, diese Woche', 'Nach ein paar Tagen', 'Nach einer guten Woche', 'Erst wenn es passt'],
    o_en: ['Immediately, this week', 'After a few days', 'After a good week', 'Only when it feels right'],
    c: ['Dating']
  },
  {
    q_de: 'Was ist deine größte Red Flag beim Dating?',
    q_en: 'What is your biggest red flag when dating?',
    o_de: ['Respektlosigkeit', 'Unzuverlässigkeit', 'Spiele und Manipulation', 'Keine Neugier'],
    o_en: ['Disrespect', 'Unreliability', 'Games and manipulation', 'Lack of curiosity'],
    c: ['Dating']
  },
  {
    q_de: 'Was ist deine Green Flag Nummer eins?',
    q_en: 'What is your number one green flag?',
    o_de: ['Klarer Charakter', 'Wärme und Empathie', 'Humor und Leichtigkeit', 'Verantwortung und Drive'],
    o_en: ['Clear character', 'Warmth and empathy', 'Humor and ease', 'Responsibility and drive'],
    c: ['Dating']
  },
  {
    q_de: 'Wenn du dich zu jemandem hingezogen fühlst, ist es eher...',
    q_en: 'When you are attracted to someone, is it more about...',
    o_de: ['Chemie und Blick', 'Gespräch und Gehirn', 'Werte und Haltung', 'Vibe im Alltag'],
    o_en: ['Chemistry and look', 'Conversation and intellect', 'Values and attitude', 'Everyday vibe'],
    c: ['Dating']
  },
  {
    q_de: 'Wie definierst du Exklusivität am Anfang?',
    q_en: 'How do you define exclusivity at the beginning?',
    o_de: ['Sofort klar exklusiv', 'Nach ein paar Dates', 'Nach einem Gespräch', 'Nicht wichtig, Hauptsache ehrlich'],
    o_en: ['Clearly exclusive right away', 'After a few dates', 'After a conversation', 'Not important, as long as it\'s honest'],
    c: ['Dating']
  },
  {
    q_de: 'Was macht für dich Anziehung langfristig aus?',
    q_en: 'What makes attraction last for you long-term?',
    o_de: ['Wachstum und Ziele', 'Humor und Spiel', 'Zärtlichkeit', 'Verlässlichkeit'],
    o_en: ['Growth and goals', 'Humor and play', 'Tenderness', 'Reliability'],
    c: ['Dating']
  },
  {
    q_de: 'Ihr seid zu spät und das Restaurant ist voll. Was tust du?',
    q_en: 'You are late and the restaurant is full. What do you do?',
    o_de: ['Ich finde sofort Plan B', 'Ich bleibe ruhig und rede', 'Ich mache daraus ein Abenteuer', 'Ich werde nervös, brauche Führung'],
    o_en: ['I immediately find Plan B', 'I stay calm and talk', 'I turn it into an adventure', 'I get nervous, need guidance'],
    c: ['Dating']
  },
  {
    q_de: 'Du siehst, dass jemand beim Date unsicher ist. Was machst du?',
    q_en: 'You see that someone is insecure on a date. What do you do?',
    o_de: ['Ich stelle leichte Fragen', 'Ich gebe ehrliches Kompliment', 'Ich mache einen Witz', 'Ich lasse Raum und Zeit'],
    o_en: ['I ask easy questions', 'I give an honest compliment', 'I make a joke', 'I give space and time'],
    c: ['Dating']
  },
  {
    q_de: 'Wie zeigst du Interesse ohne Druck?',
    q_en: 'How do you show interest without pressure?',
    o_de: ['Ich höre aktiv zu', 'Ich merke mir Details', 'Ich frage nach Wünschen', 'Ich gebe Komplimente'],
    o_en: ['I listen actively', 'I remember details', 'I ask about desires', 'I give compliments'],
    c: ['Dating']
  },
  {
    q_de: 'Was ist für dich ein starkes Kompliment am Date?',
    q_en: 'What is a powerful compliment for you on a date?',
    o_de: ['Ich fühle mich bei dir ruhig', 'Ich mag deinen Blick aufs Leben', 'Du bist echt, ohne Show', 'Mit dir wird es leicht'],
    o_en: ['I feel calm with you', 'I like your perspective on life', 'You are real, without a show', 'It becomes easy with you'],
    c: ['Dating']
  },
  {
    q_de: 'Welche Frage willst du beim Dating wirklich hören?',
    q_en: 'What question do you really want to hear when dating?',
    o_de: ['Was willst du wirklich?', 'Wovor hast du Respekt?', 'Was macht dich glücklich?', 'Wie liebst du?'],
    o_en: ['What do you really want?', 'What do you respect?', 'What makes you happy?', 'How do you love?'],
    c: ['Dating']
  },
  {
    q_de: 'Was ist eine Sache, die du dir in einer neuen Liebe wünschst?',
    q_en: 'What is one thing you wish for in a new love?',
    o_de: ['Neugier und Abenteuer', 'Sicherheit und Ruhe', 'Tiefe Gespräche', 'Spiel und Leidenschaft'],
    o_en: ['Curiosity and adventure', 'Security and peace', 'Deep conversations', 'Play and passion'],
    c: ['Dating']
  },
  {
    q_de: 'Wie willst du, dass jemand mit deinen Grenzen umgeht?',
    q_en: 'How do you want someone to handle your boundaries?',
    o_de: ['Respekt und Nachfrage', 'Klarheit ohne Drama', 'Geduld und Zeit', 'Gemeinsame Regeln'],
    o_en: ['Respect and asking', 'Clarity without drama', 'Patience and time', 'Shared rules'],
    c: ['Dating']
  },
  {
    q_de: 'Wenn du 100 Prozent mutig wärst, was würdest du mir heute sagen?',
    q_en: 'If you were 100 percent brave, what would you tell me today?',
    o_de: ['Ich will dich besser kennen', 'Ich habe Angst vor Nähe', 'Ich fühle starke Anziehung', 'Ich will es langsam, echt'],
    o_en: ['I want to know you better', 'I am afraid of closeness', 'I feel a strong attraction', 'I want it slow, real'],
    c: ['Dating']
  },
  {
    q_de: 'Welche Art Nähe beruhigt dich am schnellsten?',
    q_en: 'What kind of closeness calms you the fastest?',
    o_de: ['Augenkontakt, Stille', 'Umarmung, lang', 'Gemeinsam lachen', 'Gemeinsam etwas tun'],
    o_en: ['Eye contact, silence', 'A long hug', 'Laughing together', 'Doing something together'],
    c: ['Dating']
  },
  {
    q_de: 'Was wäre für dich ein perfektes zweites Date?',
    q_en: 'What would be a perfect second date for you?',
    o_de: ['Etwas Neues ausprobieren', 'Kochen und Musik', 'Spaziergang und Gespräche', 'Gemeinsam Sport'],
    o_en: ['Trying something new', 'Cooking and music', 'A walk and conversations', 'Playing sports together'],
    c: ['Dating']
  },
  {
    q_de: 'Welches Ritual würde uns als Paar stärker machen?',
    q_en: 'What ritual would make us stronger as a couple?',
    o_de: ['Tägliches Check-in', 'Date Night wöchentlich', 'Handy-freie Stunde', 'Spaziergang-Ritual'],
    o_en: ['Daily check-in', 'Weekly date night', 'Phone-free hour', 'A walking ritual'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Was ist dein wichtigster Liebesbeweis im Alltag?',
    q_en: 'What is your most important proof of love in everyday life?',
    o_de: ['Zeit und Präsenz', 'Berührung und Nähe', 'Hilfe und Taten', 'Worte und Nachrichten'],
    o_en: ['Time and presence', 'Touch and closeness', 'Help and actions', 'Words and messages'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Wie teilt ihr euch Aufgaben am fairsten?',
    q_en: 'How do you divide tasks most fairly?',
    o_de: ['Fixe Rollen', 'Je nach Woche', 'Nach Stärken', 'Alles zusammen'],
    o_en: ['Fixed roles', 'Depending on the week', 'According to strengths', 'Everything together'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Wenn wir Streit haben, was ist dir am wichtigsten?',
    q_en: 'When we argue, what is most important to you?',
    o_de: ['Respekt im Ton', 'Schnell klären', 'Erst Gefühle, dann Lösung', 'Pause, dann Gespräch'],
    o_en: ['Respectful tone', 'Resolve it quickly', 'Feelings first, then solution', 'A break, then a talk'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Was ist für dich ein Dealbreaker in unserer Liebe?',
    q_en: 'What is a dealbreaker for you in our love?',
    o_de: ['Lügen', 'Respektverlust', 'Dauernde Kälte', 'Keine Veränderung'],
    o_en: ['Lies', 'Loss of respect', 'Constant coldness', 'No change'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Woran merkst du, dass du mir vertraust?',
    q_en: 'How do you know you trust me?',
    o_de: ['Du siehst mein Inneres', 'Ich kann schwach sein', 'Stille ist sicher', 'Ich kann Hilfe annehmen'],
    o_en: ['You see my inner self', 'I can be weak', 'Silence is safe', 'I can accept help'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Welche Zukunft fühlt sich für dich nach uns an?',
    q_en: 'What future feels like "us" to you?',
    o_de: ['Abenteuer und Freiheit', 'Zuhause und Stabilität', 'Große Ziele gemeinsam', 'Mischung aus allem'],
    o_en: ['Adventure and freedom', 'Home and stability', 'Big goals together', 'A mix of everything'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Wie sollten wir über Geld reden?',
    q_en: 'How should we talk about money?',
    o_de: ['Offen, regelmäßig', 'Nur wenn nötig', 'Mit Budget-Plan', 'Nach Gefühl und Fairness'],
    o_en: ['Openly, regularly', 'Only when necessary', 'With a budget plan', 'Based on feeling and fairness'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Welche Art Nähe fehlt dir manchmal?',
    q_en: 'What kind of closeness do you sometimes miss?',
    o_de: ['Mehr Berührung', 'Mehr Gespräche', 'Mehr Abenteuer', 'Mehr Ruhe'],
    o_en: ['More touch', 'More conversations', 'More adventure', 'More quiet'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Was ist für dich der schönste Valentinstag-Moment?',
    q_en: 'What is the most beautiful Valentine\'s Day moment for you?',
    o_de: ['Blick und Stille', 'Brief oder Karte', 'Gemeinsames Erlebnis', 'Kleine Überraschung'],
    o_en: ['A look and silence', 'A letter or card', 'A shared experience', 'A small surprise'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Du bist krank und ich habe viel zu tun. Was wäre Liebe?',
    q_en: 'You are sick and I have a lot to do. What would be love?',
    o_de: ['Kurz vorbeikommen, kümmern', 'Essen und Medikamente organisieren', 'Telefon und Check-in', 'Ruhe geben, aber erreichbar sein'],
    o_en: ['Come by briefly, take care', 'Organize food and medicine', 'Call and check in', 'Give space, but be available'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Wir haben nur wenig Zeit heute. Was wählst du?',
    q_en: 'We have only little time today. What do you choose?',
    o_de: ['Kurzes Gespräch mit Tiefe', 'Zusammen essen ohne Handy', 'Umarmung und Nähe', 'Mini-Spaziergang'],
    o_en: ['A short, deep conversation', 'Eating together without phones', 'A hug and closeness', 'A mini walk'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Welche Wahrheit ist schwer, aber wichtig für uns?',
    q_en: 'What truth is difficult but important for us?',
    o_de: ['Ich brauche mehr Sicherheit', 'Ich brauche mehr Freiheit', 'Ich fühle mich manchmal allein', 'Ich will mehr Ehrlichkeit'],
    o_en: ['I need more security', 'I need more freedom', 'I sometimes feel lonely', 'I want more honesty'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Was würdest du dir wünschen, dass ich öfter sehe?',
    q_en: 'What do you wish I would see more often?',
    o_de: ['Meine Mühe', 'Meine Angst', 'Mein Traum', 'Meine Grenzen'],
    o_en: ['My effort', 'My fear', 'My dream', 'My boundaries'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Wenn wir uns verlieren würden, was wäre der Grund?',
    q_en: 'If we were to lose each other, what would be the reason?',
    o_de: ['Zu wenig Zeit', 'Zu wenig Respekt', 'Zu wenig Gespräche', 'Zu viel Ego'],
    o_en: ['Too little time', 'Too little respect', 'Too few conversations', 'Too much ego'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Welches Versprechen macht dich ruhig?',
    q_en: 'What promise calms you down?',
    o_de: ['Wir bleiben neugierig', 'Wir sprechen früh', 'Wir schützen unsere Zeit', 'Wir sind ein Team'],
    o_en: ['We will stay curious', 'We will talk early', 'We will protect our time', 'We are a team'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Welche Szene beschreibt dich gerade am besten?',
    q_en: 'Which scene describes you best right now?',
    o_de: ['Mähne des Löwen', 'Blick des Adlers', 'Lächeln des Wolfes', 'Lavaherz am Vulkan'],
    o_en: ['The lion\'s mane', 'The eagle\'s gaze', 'The wolf\'s smile', 'The lava heart of a volcano'],
    c: ['Liebespaar', 'Ehepaar', 'Dating']
  },
  {
    q_de: 'Wenn ich dich so sehe, was bist du für mich?',
    q_en: 'When I see you like this, what are you to me?',
    o_de: ['Pulsendes Leben', 'Freies Tier', 'Legende, die bleibt', 'Meer und Sturm'],
    o_en: ['Pulsing life', 'A free animal', 'A legend that remains', 'Sea and storm'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Wenn heute unser letzter Abend wäre, was würdest du sagen?',
    q_en: 'If tonight were our last evening, what would you say?',
    o_de: ['Danke, dass du mich siehst', 'Ich bin stolz auf uns', 'Du bist mein Zuhause', 'Vergiss nie, wer du bist'],
    o_en: ['Thank you for seeing me', 'I am proud of us', 'You are my home', 'Never forget who you are'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Welche Frage würdest du mir stellen, wenn du ganz mutig bist?',
    q_en: 'What question would you ask me if you were very brave?',
    o_de: ['Was willst du wirklich?', 'Wovor läufst du weg?', 'Was hältst du zurück?', 'Was brauchst du von mir?'],
    o_en: ['What do you really want?', 'What are you running from?', 'What are you holding back?', 'What do you need from me?'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Wie wollen wir Familie und Arbeit fair balancieren?',
    q_en: 'How do we want to balance family and work fairly?',
    o_de: ['Mit festen Zeiten', 'Mit flexibler Woche', 'Mit klaren Prioritäten', 'Mit Hilfe, outsourcen'],
    o_en: ['With fixed times', 'With a flexible week', 'With clear priorities', 'With help, outsourcing'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Welche Aufgabe nervt dich am meisten im Haushalt?',
    q_en: 'Which household chore annoys you the most?',
    o_de: ['Aufräumen', 'Putzen', 'Einkaufen', 'Planen, organisieren'],
    o_en: ['Tidying up', 'Cleaning', 'Shopping', 'Planning, organizing'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Wenn ein großer Streit passiert, was ist unser Notfall-Plan?',
    q_en: 'If a big fight happens, what is our emergency plan?',
    o_de: ['Pause und dann Gespräch', 'Mediator, Freund, Therapie', 'Regeln aufschreiben', 'Kurztrip, Abstand'],
    o_en: ['A break and then a talk', 'Mediator, friend, therapy', 'Write down rules', 'Short trip, distance'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Welche Vision macht dich als Ehe ruhiger?',
    q_en: 'What vision makes you calmer as a married couple?',
    o_de: ['Gemeinsames Zuhause', 'Gemeinsame Reisen', 'Gemeinsames Projekt', 'Gemeinsame Familie'],
    o_en: ['A shared home', 'Shared travels', 'A shared project', 'A shared family'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Wie treffen wir große Kauf-Entscheidungen?',
    q_en: 'How do we make big purchasing decisions?',
    o_de: ['Budget und Checkliste', 'Eine Nacht drüber schlafen', 'Beide haben Vetorecht', 'Wer es will, zahlt mehr Anteil'],
    o_en: ['Budget and checklist', 'Sleep on it for a night', 'Both have veto power', 'Whoever wants it pays a larger share'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Wie gehen wir mit Schwiegerfamilie-Grenzen um?',
    q_en: 'How do we handle boundaries with in-laws?',
    o_de: ['Wir sind ein Team', 'Klare Regeln, freundlich', 'Jeder regelt seine Familie', 'Situationsabhängig'],
    o_en: ['We are a team', 'Clear rules, friendly', 'Each one handles their family', 'Depends on the situation'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Was hält Leidenschaft in einer Ehe lebendig?',
    q_en: 'What keeps passion alive in a marriage?',
    o_de: ['Neugier und Dates', 'Körperkontakt täglich', 'Offene Gespräche', 'Gemeinsame Ziele'],
    o_en: ['Curiosity and dates', 'Daily physical contact', 'Open conversations', 'Shared goals'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Welche drei Dinge müssen in unserer Ehe sicher sein?',
    q_en: 'What three things must be certain in our marriage?',
    o_de: ['Respekt', 'Ehrlichkeit', 'Zuverlässigkeit', 'Wachstum'],
    o_en: ['Respect', 'Honesty', 'Reliability', 'Growth'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Was bedeutet Treue für dich in einer Ehe?',
    q_en: 'What does fidelity mean to you in a marriage?',
    o_de: ['Klar exklusiv', 'Emotionale Loyalität', 'Transparenz und Grenzen', 'Gemeinsame Entscheidung'],
    o_en: ['Clearly exclusive', 'Emotional loyalty', 'Transparency and boundaries', 'A joint decision'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Wovor hast du am meisten Respekt in unserer gemeinsamen Zukunft?',
    q_en: 'What do you respect the most in our shared future?',
    o_de: ['Dass wir uns verlieren', 'Dass Stress uns härtet', 'Dass wir zu wenig reden', 'Dass wir Träume aufgeben'],
    o_en: ['That we lose each other', 'That stress hardens us', 'That we talk too little', 'That we give up on dreams'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Was schafft Vertrauen im Team am schnellsten?',
    q_en: 'What builds trust in a team the fastest?',
    o_de: ['Klare Ownership', 'Respektvoller Ton', 'Transparente Infos', 'Schnelle Hilfe'],
    o_en: ['Clear ownership', 'Respectful tone', 'Transparent information', 'Quick help'],
    c: ['Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Wie willst du Feedback bekommen?',
    q_en: 'How do you want to receive feedback?',
    o_de: ['Direkt und konkret', 'Privat und ruhig', 'Mit Beispiel und Lösung', 'Schriftlich, strukturiert'],
    o_en: ['Direct and concrete', 'Private and calm', 'With an example and solution', 'In writing, structured'],
    c: ['Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Wenn ein Projekt brennt, was ist dein Stil?',
    q_en: 'When a project is on fire, what is your style?',
    o_de: ['Prioritäten hart setzen', 'Ruhig koordinieren', 'Hands-on, sofort fixen', 'Team-Moral schützen'],
    o_en: ['Set priorities hard', 'Coordinate calmly', 'Hands-on, fix immediately', 'Protect team morale'],
    c: ['Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Was nervt dich am meisten im Arbeitschat?',
    q_en: 'What annoys you the most in the work chat?',
    o_de: ['Unklare Aufgaben', 'Ping ohne Kontext', 'Zu viele Meetings', 'Passiv-aggressiver Ton'],
    o_en: ['Unclear tasks', 'Ping without context', 'Too many meetings', 'Passive-aggressive tone'],
    c: ['Arbeitskollegen']
  },
  {
    q_de: 'Wie fühlst du dich im Job wertgeschätzt?',
    q_en: 'How do you feel valued at work?',
    o_de: ['Anerkennung für Ergebnisse', 'Autonomie, Vertrauen', 'Gute Bezahlung', 'Wachstum und Lernen'],
    o_en: ['Recognition for results', 'Autonomy, trust', 'Good pay', 'Growth and learning'],
    c: ['Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Was ist dir bei einem Geschäftspartner am wichtigsten?',
    q_en: 'What is most important to you in a business partner?',
    o_de: ['Integrität', 'Tempo und Umsetzung', 'Qualität und Detail', 'Netzwerk und Chancen'],
    o_en: ['Integrity', 'Speed and implementation', 'Quality and detail', 'Network and opportunities'],
    c: ['Geschäftspartner']
  },
  {
    q_de: 'Wie sollen wir Entscheidungen treffen, wenn wir uneins sind?',
    q_en: 'How should we make decisions when we disagree?',
    o_de: ['Daten entscheiden', 'Pilot und messen', 'Vetorecht klar definieren', 'Dritter entscheidet'],
    o_en: ['Data decides', 'Pilot and measure', 'Clearly define veto power', 'A third party decides'],
    c: ['Geschäftspartner']
  },
  {
    q_de: 'Wie gehen wir mit Risiko um?',
    q_en: 'How do we handle risk?',
    o_de: ['Klein starten, testen', 'Mutig, all-in', 'Risiko teilen, absichern', 'Nur wenn sicher'],
    o_en: ['Start small, test', 'Brave, all-in', 'Share risk, secure', 'Only when certain'],
    c: ['Geschäftspartner']
  },
  {
    q_de: 'Wie teilen wir Gewinn und Aufwand fair?',
    q_en: 'How do we share profit and effort fairly?',
    o_de: ['Nach Input-Stunden', 'Nach Wertbeitrag', 'Fix plus Bonus', 'Erst klarer Vertrag'],
    o_en: ['By input hours', 'By value contribution', 'Fixed plus bonus', 'Clear contract first'],
    c: ['Geschäftspartner']
  },
  {
    q_de: 'Wenn ein Kunde wütend ist, was ist die beste Strategie?',
    q_en: 'If a customer is angry, what is the best strategy?',
    o_de: ['Zuhören und anerkennen', 'Sofort Lösung anbieten', 'Fakten sammeln, dann reagieren', 'Kulanz, um Beziehung zu retten'],
    o_en: ['Listen and acknowledge', 'Offer a solution immediately', 'Gather facts, then react', 'Goodwill to save the relationship'],
    c: ['Geschäftspartner', 'Arbeitskollegen']
  },
  {
    q_de: 'Wenn du ein Wort wählen müsstest für heute, welches?',
    q_en: 'If you had to choose one word for today, which one?',
    o_de: ['Leicht', 'Mutig', 'Ruhig', 'Neugierig'],
    o_en: ['Easy', 'Brave', 'Calm', 'Curious'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Freunde', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Was ist für dich die beste Art der Entspannung?',
    q_en: 'What is the best way for you to relax?',
    o_de: ['Bewegung', 'Essen kochen', 'Musik', 'Schlaf'],
    o_en: ['Movement', 'Cooking', 'Music', 'Sleep'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Freunde', 'Arbeitskollegen']
  },
  {
    q_de: 'Wie zeigst du, dass du jemanden respektierst?',
    q_en: 'How do you show that you respect someone?',
    o_de: ['Ich höre zu', 'Ich halte Zusagen', 'Ich bin fair', 'Ich bin freundlich'],
    o_en: ['I listen', 'I keep promises', 'I am fair', 'I am friendly'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Was ist deine Lieblingsart von Humor?',
    q_en: 'What is your favorite type of humor?',
    o_de: ['Trocken', 'Sarkasmus, leicht', 'Absurd', 'Warm und lieb'],
    o_en: ['Dry', 'Sarcasm, light', 'Absurd', 'Warm and kind'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Freunde', 'Arbeitskollegen']
  },
  {
    q_de: 'Wenn du eine Stunde frei bekommst, was machst du?',
    q_en: 'If you get an hour free, what do you do?',
    o_de: ['Spazieren', 'Powernap', 'Kaffee und lesen', 'Aufräumen, Reset'],
    o_en: ['A walk', 'A power nap', 'Coffee and reading', 'Tidying up, reset'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Freunde', 'Arbeitskollegen']
  },
  {
    q_de: 'Wie gehst du mit Ungewissheit um?',
    q_en: 'How do you deal with uncertainty?',
    o_de: ['Ich plane', 'Ich vertraue', 'Ich recherchiere', 'Ich warte ab'],
    o_en: ['I plan', 'I trust', 'I research', 'I wait and see'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Was ist für dich ein echtes Zeichen von Stärke?',
    q_en: 'What is a real sign of strength for you?',
    o_de: ['Grenzen setzen', 'Fehler zugeben', 'Dranbleiben', 'Mitgefühl zeigen'],
    o_en: ['Setting boundaries', 'Admitting mistakes', 'Persevering', 'Showing compassion'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Wenn du nervös bist, was hilft dir schnell?',
    q_en: 'When you are nervous, what helps you quickly?',
    o_de: ['Atmen und zählen', 'Bewegen', 'Reden', 'Ablenkung'],
    o_en: ['Breathing and counting', 'Moving', 'Talking', 'Distraction'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Freunde', 'Arbeitskollegen']
  },
  {
    q_de: 'Was ist für dich ein perfekter Abend?',
    q_en: 'What is a perfect evening for you?',
    o_de: ['Gutes Gespräch', 'Gutes Essen', 'Gute Musik', 'Gute Ruhe'],
    o_en: ['Good conversation', 'Good food', 'Good music', 'Good quiet'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Freunde']
  },
  {
    q_de: 'Welche Art Geschenk berührt dich am meisten?',
    q_en: 'What kind of gift touches you the most?',
    o_de: ['Handgemacht', 'Praktisch', 'Erlebnis', 'Worte, Brief'],
    o_en: ['Handmade', 'Practical', 'Experience', 'Words, letter'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Beste Freunde']
  },
  {
    q_de: 'Wenn du eine Gewohnheit sofort ändern könntest, welche?',
    q_en: 'If you could change one habit immediately, which one?',
    o_de: ['Besser schlafen', 'Mehr Sport', 'Mehr Ordnung', 'Weniger Stress'],
    o_en: ['Sleep better', 'More sports', 'More order', 'Less stress'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen']
  },
  {
    q_de: 'Wie reagierst du, wenn jemand dich missversteht?',
    q_en: 'How do you react when someone misunderstands you?',
    o_de: ['Ich erkläre ruhig', 'Ich frage nach', 'Ich werde frustriert', 'Ich lasse es erstmal'],
    o_en: ['I explain calmly', 'I ask questions', 'I get frustrated', 'I let it be for now'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Was motiviert dich mehr?',
    q_en: 'What motivates you more?',
    o_de: ['Belohnung', 'Sinn', 'Wettkampf', 'Verantwortung'],
    o_en: ['Reward', 'Purpose', 'Competition', 'Responsibility'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Du findest einen Geldschein am Boden. Was machst du?',
    q_en: 'You find a banknote on the ground. What do you do?',
    o_de: ['Ich suche den Besitzer', 'Ich gebe ihn ab', 'Ich spende ihn', 'Ich behalte ihn'],
    o_en: ['I look for the owner', 'I turn it in', 'I donate it', 'I keep it'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Freunde', 'Arbeitskollegen']
  },
  {
    q_de: 'Ein Freund sagt etwas Hartes. Wie reagierst du?',
    q_en: 'A friend says something harsh. How do you react?',
    o_de: ['Ich frage nach Kontext', 'Ich werde defensiv', 'Ich nehme es an', 'Ich ziehe mich zurück'],
    o_en: ['I ask for context', 'I get defensive', 'I accept it', 'I withdraw'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Freunde', 'Beste Freunde']
  },
  {
    q_de: 'Was ist deine Lieblingsart zu lernen?',
    q_en: 'What is your favorite way to learn?',
    o_de: ['Durch Tun', 'Durch Lesen', 'Durch Videos', 'Durch Gespräch'],
    o_en: ['By doing', 'By reading', 'Through videos', 'Through conversation'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Welche Rolle spielt Routine für dich?',
    q_en: 'What role does routine play for you?',
    o_de: ['Ich brauche sie', 'Ich mag Mischung', 'Ich vermeide sie', 'Ich baue sie neu'],
    o_en: ['I need it', 'I like a mix', 'I avoid it', 'I rebuild it'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen']
  },
  {
    q_de: 'Wenn du dich verletzt fühlst, was tust du?',
    q_en: 'When you feel hurt, what do you do?',
    o_de: ['Ich spreche direkt', 'Ich brauche Abstand', 'Ich schlucke es', 'Ich schreibe es auf'],
    o_en: ['I speak directly', 'I need space', 'I swallow it', 'I write it down'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Beste Freunde', 'Arbeitskollegen']
  },
  {
    q_de: 'Was ist dir wichtiger im Leben gerade?',
    q_en: 'What is more important to you in life right now?',
    o_de: ['Freiheit', 'Sicherheit', 'Wachstum', 'Liebe'],
    o_en: ['Freedom', 'Security', 'Growth', 'Love'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Wenn jemand dir hilft, wie reagierst du?',
    q_en: 'When someone helps you, how do you react?',
    o_de: ['Ich bedanke mich konkret', 'Ich revanchiere mich', 'Ich fühle mich unwohl', 'Ich nehme es leicht'],
    o_en: ['I thank them specifically', 'I return the favor', 'I feel uncomfortable', 'I take it lightly'],
    c: ['Dating', 'Liebespaar', 'Ehepaar', 'Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Welche Art Date macht dich am schnellsten verliebt?',
    q_en: 'What kind of date makes you fall in love the fastest?',
    o_de: ['Spaziergang und reden', 'Gemeinsame Challenge', 'Kochen und Musik', 'Kunst, Kino, Museum'],
    o_en: ['A walk and talk', 'A shared challenge', 'Cooking and music', 'Art, cinema, museum'],
    c: ['Dating']
  },
  {
    q_de: 'Was ist für dich ein No-Go beim ersten Date?',
    q_en: 'What is a no-go for you on a first date?',
    o_de: ['Unhöflich zu Service', 'Nur über Ex reden', 'Nur am Handy', 'Zu viel Alkohol'],
    o_en: ['Rude to staff', 'Only talking about an ex', 'Only on the phone', 'Too much alcohol'],
    c: ['Dating']
  },
  {
    q_de: 'Wie zeigst du Interesse beim Kennenlernen?',
    q_en: 'How do you show interest when getting to know someone?',
    o_de: ['Viele Fragen', 'Körpernähe', 'Zeit investieren', 'Kleine Komplimente'],
    o_en: ['Many questions', 'Physical closeness', 'Investing time', 'Small compliments'],
    c: ['Dating']
  },
  {
    q_de: 'Was willst du früh wissen, bevor du dich öffnest?',
    q_en: 'What do you want to know early on before you open up?',
    o_de: ['Wie jemand streitet', 'Wie jemand liebt', 'Wie jemand arbeitet', 'Wie jemand lebt'],
    o_en: ['How someone argues', 'How someone loves', 'How someone works', 'How someone lives'],
    c: ['Dating']
  },
  {
    q_de: 'Welche Art Tempo passt dir besser?',
    q_en: 'What kind of pace suits you better?',
    o_de: ['Langsam, sicher', 'Schnell, intensiv', 'Je nach Vibe', 'Erst Freundschaft'],
    o_en: ['Slow, sure', 'Fast, intense', 'Depending on the vibe', 'Friendship first'],
    c: ['Dating']
  },
  {
    q_de: 'Wenn jemand Dates absagt, wie reagierst du?',
    q_en: 'When someone cancels dates, how do you react?',
    o_de: ['Ich frage direkt', 'Ich bleibe entspannt', 'Ich verliere Interesse', 'Ich plane neu'],
    o_en: ['I ask directly', 'I stay relaxed', 'I lose interest', 'I reschedule'],
    c: ['Dating']
  },
  {
    q_de: 'Ihr trefft Bekannte beim Date. Wie verhältst du dich?',
    q_en: 'You meet acquaintances on a date. How do you behave?',
    o_de: ['Kurz freundlich, dann zurück', 'Ich stelle dich stolz vor', 'Ich werde unsicher', 'Ich mache es locker'],
    o_en: ['Briefly friendly, then back', 'I introduce you proudly', 'I get insecure', 'I keep it casual'],
    c: ['Dating']
  },
  {
    q_de: 'Die Chemie ist da, aber Werte sind unklar. Was tust du?',
    q_en: 'The chemistry is there, but values are unclear. What do you do?',
    o_de: ['Ich frage nach Werten', 'Ich genieße und schaue', 'Ich bremse sofort', 'Ich beende es'],
    o_en: ['I ask about values', 'I enjoy and see', 'I hit the brakes immediately', 'I end it'],
    c: ['Dating']
  },
  {
    q_de: 'Was ist für dich ein Zeichen, dass jemand dich wirklich sieht?',
    q_en: 'What is a sign for you that someone really sees you?',
    o_de: ['Er merkt Details', 'Er fragt nach Gefühl', 'Er respektiert Grenzen', 'Er macht Zeit frei'],
    o_en: ['They notice details', 'They ask about feelings', 'They respect boundaries', 'They make time'],
    c: ['Dating']
  },
  {
    q_de: 'Welche Art Nachricht ist für dich Love Language?',
    q_en: 'What kind of message is a love language for you?',
    o_de: ['Kurzes "Ich denke an dich"', 'Sprachnachricht', 'Meme, Humor', 'Plan für Treffen'],
    o_en: ['A short "I\'m thinking of you"', 'A voice message', 'A meme, humor', 'A plan to meet'],
    c: ['Dating']
  },
  {
    q_de: 'Was ist deine größte Hoffnung in einer neuen Beziehung?',
    q_en: 'What is your biggest hope in a new relationship?',
    o_de: ['Echte Nähe', 'Gemeinsam wachsen', 'Leichtigkeit', 'Sicherheit'],
    o_en: ['Real closeness', 'Growing together', 'Ease', 'Security'],
    c: ['Dating']
  },
  {
    q_de: 'Was ist deine größte Angst beim Verlieben?',
    q_en: 'What is your biggest fear when falling in love?',
    o_de: ['Verlassen werden', 'Kontrolle verlieren', 'Nicht genug sein', 'Alltag killt es'],
    o_en: ['Being abandoned', 'Losing control', 'Not being enough', 'Everyday life kills it'],
    c: ['Dating']
  },
  {
    q_de: 'Welche Frage bringt dich sofort in die Tiefe?',
    q_en: 'What question immediately takes you to a deep level?',
    o_de: ['Was treibt dich an?', 'Wofür schämst du dich?', 'Wann warst du mutig?', 'Was brauchst du?'],
    o_en: ['What drives you?', 'What are you ashamed of?', 'When were you brave?', 'What do you need?'],
    c: ['Dating']
  },
  {
    q_de: 'Wie willst du Konflikte früh klären?',
    q_en: 'How do you want to resolve conflicts early on?',
    o_de: ['Sofort ruhig reden', 'Zeit, dann Gespräch', 'Schriftlich sortieren', 'Mit Humor starten'],
    o_en: ['Talk calmly immediately', 'Time, then a talk', 'Sort it out in writing', 'Start with humor'],
    c: ['Dating']
  },
  {
    q_de: 'Was wäre ein mutiges Valentinstag-Statement von dir?',
    q_en: 'What would be a brave Valentine\'s Day statement from you?',
    o_de: ['Ich will dich echt', 'Ich will langsam, echt', 'Ich will dich heute küssen', 'Ich will Zukunft testen'],
    o_en: ['I want you for real', 'I want it slow, real', 'I want to kiss you today', 'I want to test the future'],
    c: ['Dating']
  },
  {
    q_de: 'Wenn du jemanden magst, wie zeigt sich das bei dir?',
    q_en: 'When you like someone, how does it show in you?',
    o_de: ['Ich werde neugierig', 'Ich werde verspielt', 'Ich werde vorsichtig', 'Ich werde sehr präsent'],
    o_en: ['I get curious', 'I get playful', 'I get cautious', 'I become very present'],
    c: ['Dating']
  },
  {
    q_de: 'Was ist für dich echte Romantik?',
    q_en: 'What is real romance for you?',
    o_de: ['Aufmerksamkeit', 'Mut zur Wahrheit', 'Kleine Taten', 'Ein Moment Stille'],
    o_en: ['Attention', 'Courage for truth', 'Small actions', 'A moment of silence'],
    c: ['Dating']
  },
  {
    q_de: 'Du merkst, du redest zu viel. Was machst du?',
    q_en: 'You realize you are talking too much. What do you do?',
    o_de: ['Ich stelle Fragen', 'Ich lache und stoppe', 'Ich werde nervös', 'Ich wechsle Thema'],
    o_en: ['I ask questions', 'I laugh and stop', 'I get nervous', 'I change the subject'],
    c: ['Dating']
  },
  {
    q_de: 'Ihr seid beim Date im Regen ohne Schirm. Was passiert?',
    q_en: 'You are on a date in the rain without an umbrella. What happens?',
    o_de: ['Wir lachen und laufen', 'Wir suchen ein Café', 'Wir bleiben stehen, küssen', 'Wir werden genervt'],
    o_en: ['We laugh and run', 'We look for a café', 'We stand still, kiss', 'We get annoyed'],
    c: ['Dating']
  },
  {
    q_de: 'Woran merkst du, dass du bereit bist für eine Beziehung?',
    q_en: 'How do you know you are ready for a relationship?',
    o_de: ['Ich bin stabil', 'Ich bin neugierig', 'Ich bin offen', 'Ich will Commitment'],
    o_en: ['I am stable', 'I am curious', 'I am open', 'I want commitment'],
    c: ['Dating']
  },
  {
    q_de: 'Welche Sache willst du, dass ich über deinen Stress weiß?',
    q_en: 'What thing do you want me to know about your stress?',
    o_de: ['Ich brauche Ruhe', 'Ich brauche Lösung', 'Ich brauche Nähe', 'Ich brauche Humor'],
    o_en: ['I need quiet', 'I need a solution', 'I need closeness', 'I need humor'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Wie sollen wir Valentinstag feiern, wenn wir viel Arbeit haben?',
    q_en: 'How should we celebrate Valentine\'s Day if we have a lot of work?',
    o_de: ['Kleines Ritual', 'Date-Lunch, kurz', 'Abends Brief', 'Verschieben mit Plan'],
    o_en: ['A small ritual', 'A short lunch date', 'A letter in the evening', 'Postpone with a plan'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Was ist für dich emotionale Treue?',
    q_en: 'What is emotional fidelity for you?',
    o_de: ['Grenzen klar', 'Ehrlich erzählen', 'Keine Geheimnisse', 'Team-Gefühl schützen'],
    o_en: ['Clear boundaries', 'Telling honestly', 'No secrets', 'Protecting the team feeling'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Welche Art Berührung fühlt sich für dich wie Zuhause an?',
    q_en: 'What kind of touch feels like home to you?',
    o_de: ['Hand halten', 'Umarmung, lang', 'Kuscheln, ruhig', 'Kuss, spontan'],
    o_en: ['Holding hands', 'A long hug', 'Cuddling, quiet', 'A spontaneous kiss'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Wenn wir feststecken, was ist der beste Reset?',
    q_en: 'When we are stuck, what is the best reset?',
    o_de: ['Spaziergang', 'Umarmung', 'Schlafen und neu', 'Schreiben statt reden'],
    o_en: ['A walk', 'A hug', 'Sleep and anew', 'Writing instead of talking'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Welche Aussage triggert dich am meisten im Streit?',
    q_en: 'What statement triggers you the most in an argument?',
    o_de: ['"Du immer, du nie"', '"Ist mir egal"', '"Stell dich nicht so an"', '"Mach, was du willst"'],
    o_en: ['"You always, you never"', '"I don\'t care"', '"Don\'t be like that"', '"Do what you want"'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Was ist unser nächstes gemeinsames Level?',
    q_en: 'What is our next level together?',
    o_de: ['Reise planen', 'Ziele definieren', 'Finanzen ordnen', 'Mehr Dates'],
    o_en: ['Plan a trip', 'Define goals', 'Organize finances', 'More dates'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Welches Mini-Ritual jeden Tag würdest du wählen?',
    q_en: 'Which mini-ritual would you choose for every day?',
    o_de: ['Kuss vor dem Rausgehen', '10 Minuten reden', 'Handy-frei essen', 'Danke-Satz'],
    o_en: ['A kiss before leaving', 'Talking for 10 minutes', 'Eating phone-free', 'A "thank you" sentence'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Wenn ich schlecht drauf bin, wie willst du reagieren?',
    q_en: 'If I am in a bad mood, how do you want to react?',
    o_de: ['Nachfragen, ruhig', 'Abstand geben', 'Aufheitern, Humor', 'Praktisch helfen'],
    o_en: ['Ask calmly', 'Give space', 'Cheer up, humor', 'Help practically'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Wir sind unterwegs und ich verliere etwas Wichtiges. Was tust du?',
    q_en: 'We are out and I lose something important. What do you do?',
    o_de: ['Ruhig suchen', 'Sofort Lösungen', 'Ich bleibe bei dir', 'Ich werde hektisch'],
    o_en: ['Search calmly', 'Solutions immediately', 'I stay with you', 'I get hectic'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Welche Wahrheit über dich soll ich besser verstehen?',
    q_en: 'What truth about you should I understand better?',
    o_de: ['Meine Angst', 'Mein Traum', 'Meine Wut', 'Meine Scham'],
    o_en: ['My fear', 'My dream', 'My anger', 'My shame'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Was ist deine stille Bitte an mich?',
    q_en: 'What is your silent request to me?',
    o_de: ['Mehr sehen', 'Mehr zuhören', 'Mehr anfassen', 'Mehr vertrauen'],
    o_en: ['See more', 'Listen more', 'Touch more', 'Trust more'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Wann fühlst du dich von mir am meisten geliebt?',
    q_en: 'When do you feel most loved by me?',
    o_de: ['Wenn ich präsent bin', 'Wenn ich dich verteidige', 'Wenn ich dich berühre', 'Wenn ich dich lobe'],
    o_en: ['When I am present', 'When I defend you', 'When I touch you', 'When I praise you'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Was ist ein Risiko, das du für uns eingehen würdest?',
    q_en: 'What is a risk you would take for us?',
    o_de: ['Komplett ehrlich sein', 'Pläne ändern', 'Stolz schlucken', 'Hilfe annehmen'],
    o_en: ['Be completely honest', 'Change plans', 'Swallow pride', 'Accept help'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Wenn ich dich anschaue, sehe ich eher...',
    q_en: 'When I look at you, I see more of...',
    o_de: ['Freies Tier', 'Pulsendes Leben', 'Sturm im Meer', 'Lavaherz'],
    o_en: ['A free animal', 'Pulsing life', 'A storm in the sea', 'A lava heart'],
    c: ['Liebespaar', 'Ehepaar', 'Dating']
  },
  {
    q_de: 'Welche Kraft möchtest du, dass ich in dir sehe?',
    q_en: 'What power do you want me to see in you?',
    o_de: ['Löwenmähne', 'Adlerblick', 'Wolfslächeln', 'Vulkanherz'],
    o_en: ['A lion\'s mane', 'An eagle\'s gaze', 'A wolf\'s smile', 'A volcano\'s heart'],
    c: ['Liebespaar', 'Ehepaar', 'Dating']
  },
  {
    q_de: 'Wie sollen wir mit Handys umgehen, wenn wir Zeit haben?',
    q_en: 'How should we handle phones when we have time?',
    o_de: ['Ganz weg', 'Nur Fotos', 'Kurz checken', 'Egal, Hauptsache zusammen'],
    o_en: ['Put them away completely', 'Only for photos', 'Check briefly', 'Doesn\'t matter, as long as we\'re together'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Was ist dein Wunsch-Satz nach einem Streit?',
    q_en: 'What is your desired sentence after an argument?',
    o_de: ['"Wir sind ein Team"', '"Ich sehe dich"', '"Lass uns neu starten"', '"Ich liebe dich trotzdem"'],
    o_en: ['"We are a team"', '"I see you"', '"Let\'s start over"', '"I love you anyway"'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Welche gemeinsame Vision macht dich weich?',
    q_en: 'What shared vision makes you soft?',
    o_de: ['Reisen und Heimat', 'Projekt zusammen', 'Familie irgendwann', 'Freiheit zusammen'],
    o_en: ['Travel and home', 'A project together', 'Family someday', 'Freedom together'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Du bist traurig und willst nicht reden. Was soll ich tun?',
    q_en: 'You are sad and don\'t want to talk. What should I do?',
    o_de: ['Einfach halten', 'Leise da sein', 'Sanft fragen', 'Raum geben'],
    o_en: ['Just hold you', 'Be there quietly', 'Ask gently', 'Give space'],
    c: ['Liebespaar', 'Ehepaar']
  },
  {
    q_de: 'Was ist für dich der wichtigste Schutz für unsere Ehe?',
    q_en: 'What is the most important protection for our marriage for you?',
    o_de: ['Zeit zu zweit', 'Respekt im Ton', 'Offene Gespräche', 'Gemeinsame Ziele'],
    o_en: ['Time for two', 'Respectful tone', 'Open conversations', 'Shared goals'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Wie wollen wir mit wiederkehrenden Konflikten umgehen?',
    q_en: 'How do we want to deal with recurring conflicts?',
    o_de: ['Regeln definieren', 'Therapie, Coaching', 'Ritual-Gespräch', 'Akzeptanz und Humor'],
    o_en: ['Define rules', 'Therapy, coaching', 'A ritual conversation', 'Acceptance and humor'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Wenn Kinder Thema sind, was ist dir am wichtigsten?',
    q_en: 'When children are a topic, what is most important to you?',
    o_de: ['Stabilität', 'Liebe und Zeit', 'Finanzplan', 'Vorbild sein'],
    o_en: ['Stability', 'Love and time', 'Financial plan', 'Being a role model'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Wie oft sollten wir Finanz-Check-ins machen?',
    q_en: 'How often should we do financial check-ins?',
    o_de: ['Wöchentlich, kurz', 'Monatlich', 'Quartal', 'Nur bei Bedarf'],
    o_en: ['Weekly, short', 'Monthly', 'Quarterly', 'Only when needed'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Wie sollen wir Feiertage mit Familie planen?',
    q_en: 'How should we plan holidays with family?',
    o_de: ['Abwechseln', 'Gemeinsam immer', 'Eigene Tradition', 'Je nach Stimmung'],
    o_en: ['Alternate', 'Always together', 'Our own tradition', 'Depending on the mood'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Was ist dein wichtigster Schutz vor Routine?',
    q_en: 'What is your most important protection against routine?',
    o_de: ['Neue Dates', 'Neue Orte', 'Neue Gespräche', 'Neue Projekte'],
    o_en: ['New dates', 'New places', 'New conversations', 'New projects'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Wenn wir müde sind und streiten, was ist die beste Regel?',
    q_en: 'When we are tired and argue, what is the best rule?',
    o_de: ['Keine großen Themen', 'Pause bis morgen', 'Nur Gefühle benennen', 'Kurz Umarmung dann'],
    o_en: ['No big topics', 'Pause until tomorrow', 'Only name feelings', 'A short hug then'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Was muss in unserer Ehe immer erlaubt sein?',
    q_en: 'What must always be allowed in our marriage?',
    o_de: ['Fehler machen', 'Um Hilfe bitten', 'Grenzen setzen', 'Träume haben'],
    o_en: ['Making mistakes', 'Asking for help', 'Setting boundaries', 'Having dreams'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Welche Investition in uns lohnt sich am meisten?',
    q_en: 'Which investment in us is most worthwhile?',
    o_de: ['Gemeinsame Zeit', 'Gesundheit', 'Weiterbildung', 'Reisen'],
    o_en: ['Shared time', 'Health', 'Further education', 'Travel'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Was würdest du dir von mir wünschen, wenn du alt bist?',
    q_en: 'What would you wish from me when you are old?',
    o_de: ['Geduld', 'Humor', 'Zärtlichkeit', 'Stabilität'],
    o_en: ['Patience', 'Humor', 'Tenderness', 'Stability'],
    c: ['Ehepaar']
  },
  {
    q_de: 'Was ist dein größter Produktivitätskiller im Team?',
    q_en: 'What is your biggest productivity killer in the team?',
    o_de: ['Unklare Prioritäten', 'Micromanagement', 'Schlechte Kommunikation', 'Zu viele Kontextwechsel'],
    o_en: ['Unclear priorities', 'Micromanagement', 'Poor communication', 'Too much context switching'],
    c: ['Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Wie sollen wir Meetings halten, damit sie Sinn machen?',
    q_en: 'How should we hold meetings so they make sense?',
    o_de: ['Agenda und Ziel', 'Kurz, daily', 'Asynchron, schriftlich', 'Nur bei Blockern'],
    o_en: ['Agenda and goal', 'Short, daily', 'Asynchronous, in writing', 'Only for blockers'],
    c: ['Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Wenn ich dir Feedback gebe, was ist wichtig?',
    q_en: 'When I give you feedback, what is important?',
    o_de: ['Respekt und Klarheit', 'Konkrete Beispiele', 'Zeit für Rückfragen', 'Lösungen vorschlagen'],
    o_en: ['Respect and clarity', 'Concrete examples', 'Time for follow-up questions', 'Suggest solutions'],
    c: ['Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Wenn jemand im Team Fehler macht, was ist fair?',
    q_en: 'If someone in the team makes a mistake, what is fair?',
    o_de: ['Lernen und fixen', 'Verantwortung klären', 'Post-mortem ohne Schuld', 'Konsequenzen, wenn wiederholt'],
    o_en: ['Learn and fix', 'Clarify responsibility', 'Post-mortem without blame', 'Consequences if repeated'],
    c: ['Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Was ist das beste Lob im Job?',
    q_en: 'What is the best praise at work?',
    o_de: ['Du hast Impact', 'Du bist zuverlässig', 'Du denkst voraus', 'Du machst es leicht'],
    o_en: ['You have an impact', 'You are reliable', 'You think ahead', 'You make it easy'],
    c: ['Arbeitskollegen', 'Geschäftspartner']
  },
  {
    q_de: 'Welche Kennzahl ist dir am wichtigsten im Business?',
    q_en: 'Which key figure is most important to you in business?',
    o_de: ['Umsatz', 'Profit', 'Wachstum', 'Retention'],
    o_en: ['Revenue', 'Profit', 'Growth', 'Retention'],
    c: ['Geschäftspartner']
  },
  {
    q_de: 'Wenn wir einen Kunden verlieren, was tun wir zuerst?',
    q_en: 'If we lose a customer, what do we do first?',
    o_de: ['Analyse, Ursachen', 'Sofort Angebot verbessern', 'Kontakt aufnehmen', 'Prozess fixen'],
    o_en: ['Analysis, causes', 'Improve the offer immediately', 'Get in touch', 'Fix the process'],
    c: ['Geschäftspartner', 'Arbeitskollegen']
  },
  {
    q_de: 'Wie testen wir neue Ideen am schnellsten?',
    q_en: 'How do we test new ideas the fastest?',
    o_de: ['MVP, klein', 'Landing-Page-Test', 'Pilot-Kunde', 'A/B-Test'],
    o_en: ['MVP, small', 'Landing page test', 'Pilot customer', 'A/B test'],
    c: ['Geschäftspartner']
  },
  {
    q_de: 'Wie sollen wir Preise setzen?',
    q_en: 'How should we set prices?',
    o_de: ['Value-based', 'Cost-plus', 'Market match', 'Premium-Position'],
    o_en: ['Value-based', 'Cost-plus', 'Market match', 'Premium position'],
    c: ['Geschäftspartner']
  },
  {
    q_de: 'Wenn ein Partner nicht wie vereinbart liefert, was tun wir?',
    q_en: 'If a partner does not deliver as agreed, what do we do?',
    o_de: ['Klar ansprechen', 'Frist und Plan', 'Scope reduzieren', 'Beziehung beenden'],
    o_en: ['Address it clearly', 'Deadline and plan', 'Reduce scope', 'End the relationship'],
    c: ['Geschäftspartner']
  }
];


const icons: { [key: string]: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>> } = {
    'Beziehung': Heart,
    'Alltag': Home,
    'Kommunikation': MessageSquare,
    'Werte': Anchor,
    'Zukunft': Sprout,
    'Konflikt': Drama,
    'Intimität': Flame,
    'Freizeit': Sun,
    'Dating': Heart,
    'Arbeit': Briefcase,
    'Entscheidung': Key,
    'Charakter': Smile,
    'Emotionen': BrainCircuit,
    'Sonstiges': Puzzle,
    'Reisen': Plane,
    'Verhalten': User,
    'Vorlieben': ThumbsUp,
    'Wünsche': Gift,
};

const getBestIcon = (topic: string, question: string): ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>> => {
    const q = question.toLowerCase();
    if (q.includes('liebe') || q.includes('valentinstag') || q.includes('romantik') || q.includes('herz')) return icons['Intimität'];
    if (q.includes('streit') || q.includes('konflikt')) return icons['Konflikt'];
    if (q.includes('gespräch') || q.includes('reden') || q.includes('feedback')) return icons['Kommunikation'];
    if (q.includes('arbeit') || q.includes('job') || q.includes('team') || q.includes('business')) return icons['Arbeit'];
    if (q.includes('date') || q.includes('kennenlernen') || q.includes('flirt')) return icons['Dating'];
    if (q.includes('zukunft') || q.includes('ziel') || q.includes('wachstum')) return icons['Zukunft'];
    if (q.includes('entscheidung') || q.includes('plan')) return icons['Entscheidung'];
    if (q.includes('reise') || q.includes('wochenende') || q.includes('abend')) return icons['Freizeit'];
    if (q.includes('alltag') || q.includes('haushalt') || q.includes('wohnen') || q.includes('routine')) return icons['Alltag'];
    
    return icons[topic] || icons['Sonstiges'];
}


export const QUIZ_QUESTIONS: MCQuestion[] = rawQuestions.map((item, index) => {
    let topic = 'Alltag'; // Default topic
    
    const qLower = item.q_de.toLowerCase();
    if (qLower.includes('liebe') || qLower.includes('valentinstag') || qLower.includes('romantik') || qLower.includes('herz') || qLower.includes('flirt')) topic = 'Intimität';
    else if (qLower.includes('streit') || qLower.includes('konflikt') || qLower.includes('kritik')) topic = 'Konflikt';
    else if (qLower.includes('gespräch') || qLower.includes('reden') || qLower.includes('kommunikation')) topic = 'Kommunikation';
    else if (qLower.includes('arbeit') || qLower.includes('job') || qLower.includes('team') || qLower.includes('business')) topic = 'Arbeit';
    else if (qLower.includes('date') || qLower.includes('kennenlernen')) topic = 'Dating';
    else if (qLower.includes('zukunft') || qLower.includes('ziel') || qLower.includes('wachstum')) topic = 'Zukunft';
    else if (qLower.includes('entscheidung') || qLower.includes('plan')) topic = 'Entscheidung';
    else if (qLower.includes('reise') || qLower.includes('wochenende') || qLower.includes('abend') || qLower.includes('freizeit')) topic = 'Freizeit';
    else if (qLower.includes('alltag') || qLower.includes('haushalt') || qLower.includes('wohnen') || qLower.includes('routine')) topic = 'Alltag';
    else if (qLower.includes('wert') || qLower.includes('regel')) topic = 'Werte';
    else if (qLower.includes('fühlst du dich') || qLower.includes('fühlst du dich')) topic = 'Emotionen';
    else if (qLower.startsWith('was ist dein') || qLower.startsWith('welche art')) topic = 'Vorlieben';
    else if (qLower.startsWith('du ') || qLower.startsWith('wie reagierst du') || qLower.startsWith('wenn du')) topic = 'Verhalten';
     else if (qLower.startsWith('was willst du')) topic = 'Wünsche';

    const selfQuestion = {
        de: item.q_de,
        en: item.q_en,
    };

    const guessQuestion = {
        de: `Was würde dein Partner auf die Frage antworten: "${item.q_de}"?`,
        en: `What would your partner answer to the question: "${item.q_en}"?`,
    };
    
    const options = item.o_de.map((opt, i) => ({
        de: opt,
        en: item.o_en[i],
    }));

    return {
        id: index + 1,
        topic: topic,
        icon: getBestIcon(topic, selfQuestion.de),
        selfQuestion: selfQuestion,
        guessQuestion: guessQuestion,
        options: options,
        relationships: mapRelationships(item.c),
    };
});
