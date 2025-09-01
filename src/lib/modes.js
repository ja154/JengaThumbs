/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const f = s =>
  s
    .replaceAll(/([^\n{])\n([^\n}\s+])/g, '$1 $2')
    .replaceAll(/\n{3,}/g, '\n\n')
    .trim()

const baseInstruction = `You are an expert graphic designer creating a 16:9 YouTube thumbnail. The final image must be professional, high-resolution, and visually compelling. Key requirements are: 1) A clear, engaging subject. 2) Large, bold, and easily readable text that is a core part of the design. Crucially, all text must be perfectly spelled and clearly legible, with no merged or overlapping characters. 3) A dynamic composition that draws the viewer's eye. The specific art style is:`

export default {
  default: {
    name: 'Default',
    emoji: '👍',
    systemInstruction: f(`
      ${baseInstruction} a modern, high-impact style typical for popular YouTube creators. It must feature a clear, high-quality photo of a person with an expressive face, often looking towards the camera. The background should be clean, perhaps with a subtle gradient or texture, to ensure the subject pops. Text is crucial: it must be BIG, BOLD, and have extremely high contrast against the background. Use techniques like thick outlines or drop shadows to make the text readable at any size. The composition should be dynamic and draw the viewer's attention immediately.
    `),
    imageOutput: true,
    presets: [
      {
        label: 'Gaming Win',
        prompt:
          'A photo of a gamer with a shocked and excited expression, controller in hand. Text: "I CAN\'T BELIEVE I WON!"'
      },
      {
        label: 'Product Review',
        prompt:
          'A photo of a person holding a new gadget and pointing at it with a smile. Text: "IS IT WORTH IT?"'
      },
      {
        label: 'Tutorial Video',
        prompt:
          'A photo of a friendly person pointing to the side at the text. Text: "HOW TO DO THE THING"'
      },
      {
        label: 'Crazy Story',
        prompt:
          'A photo of a person with a wide-eyed, surprised look, hand on their cheek. Text: "YOU WON\'T BELIEVE THIS"'
      }
    ]
  },
  anime: {
    name: 'Tech Anime',
    emoji: '👾',
    systemInstruction: f(`
      ${baseInstruction} a modern tech-anime style. The central focus is a charismatic anime-style character with clean, sharp lines, like vector art, typically positioned on the right side of the frame. The background is dark (deep blue, purple, or black) and features abstract digital patterns, circuits, or futuristic elements. The scene is illuminated by vibrant neon lights, primarily in shades of cyan and magenta, which also create strong rim lighting on the character. The text uses a bold, sans-serif font, often stacked, and is colored with the same vibrant neon palette to ensure it stands out dramatically.
    `),
    imageOutput: true,
    presets: [
      {
        label: 'AI for Business',
        prompt:
          'An anime-style business professional in a suit, with a glowing brain icon next to them. Text: "AI FOR BUSINESS LEADERS"'
      },
      {
        label: 'Cybersecurity Guide',
        prompt:
          'An anime-style hacker character in a hoodie, with lines of code in the background. Text: "BEST SECURITY PRACTICES"'
      },
      {
        label: 'AI Content Tools',
        prompt:
          'A friendly anime character smiling, pointing towards the text. Text: "BEST AI CONTENT TOOLS"'
      },
      {
        label: 'Coding Livestream',
        prompt:
          'An anime character with headphones coding on a futuristic computer. Neon lights reflect in their glasses. Text: "VIBECODING LIVE"'
      }
    ]
  },
  cinematic: {
    name: 'Cinematic',
    emoji: '🎬',
    systemInstruction: f(`
      ${baseInstruction} a modern "creator" or "influencer" style. It features a high-quality, expressive photo of a person, often looking at the camera. The background is clean and simple, sometimes with a subtle texture or gradient, to make the subject stand out. Lighting is professional and flattering. The text is very large, bold, and has high contrast with the background, often using outlines or drop shadows for maximum readability. The overall feel is polished, professional, and engaging.
    `),
    imageOutput: true,
    presets: [
      {
        label: 'Tech Unboxing',
        prompt:
          'A photo of an excited man holding a new smartphone box. Text: "I FINALLY GOT IT!"'
      },
      {
        label: 'React Tutorial',
        prompt:
          'A photo of a female software developer smiling and pointing to a logo of the React javascript framework. Text: "REACT IN 10 MINUTES"'
      },
      {
        label: 'Finance Tips',
        prompt:
          'A photo of a person looking thoughtfully at the camera with graphics of rising stock charts in the background. Text: "My Top 5 Investments"'
      },
      {
        label: 'AI News',
        prompt:
          'A photo of a man pointing towards the text with a surprised expression. A simple background with an AI logo. Text: "AI IS CHANGING EVERYTHING"'
      }
    ]
  },
  minimalist: {
    name: 'Minimalist',
    emoji: '✨',
    systemInstruction: f(`
      ${baseInstruction} clean, modern, and minimalist. A single, bold subject against a simple, solid-colored or subtle gradient background. Emphasize negative space to create a sense of calm and focus. Typography is the hero: elegant, sans-serif, and perfectly kerned. The aesthetic is sophisticated and uncluttered.
    `),
    imageOutput: true,
    presets: [
      {
        label: 'Tech Review',
        prompt:
          'A sleek, modern smartphone on a plain colored background. Text: "The Perfect Phone?"'
      },
      {
        label: 'Design Tutorial',
        prompt:
          'A single, elegant icon representing design on a pastel background. Text: "Less is More"'
      },
      {
        label: 'Productivity Tips',
        prompt:
          'A simple line drawing of a brain with a lightbulb. Text: "10x Your Focus"'
      }
    ]
  },
  bold_typography: {
    name: 'Bold Typography',
    emoji: '📝',
    systemInstruction: f(`
      ${baseInstruction} typography-focused. The text is the hero. Use a massive, bold, eye-catching font that fills most of the frame. The background is a simple but high-contrast texture, gradient, or solid color that makes the text pop. There is no imagery, only text and background elements. The design is high-contrast and impossible to ignore.
    `),
    imageOutput: true,
    presets: [
      {
        label: 'Motivational',
        prompt:
          'A bright yellow background with the text "GET IT DONE" in massive black letters.'
      },
      {
        label: 'News Update',
        prompt:
          'A red background with white text "BREAKING NEWS" in a bold, sans-serif font.'
      },
      {
        label: 'Challenge Video',
        prompt:
          'A split-color background with the text "I TRIED IT FOR 30 DAYS" in an exciting, bold font.'
      }
    ]
  },
  vibrant: {
    name: 'Vibrant',
    emoji: '🌈',
    systemInstruction: f(`
      ${baseInstruction} energetic and vibrant. The image explodes with saturated, bright colors. The composition is dynamic with a sense of motion or excitement, using diagonal lines and overlapping elements. The imagery is fun and attention-grabbing. Text is playful, possibly with outlines or glow effects to stand out from the busy background.
    `),
    imageOutput: true,
    presets: [
      {
        label: 'Gaming Video',
        prompt:
          'An explosive scene from a video game with bright colors and neon effects. Text: "INSANE VICTORY!"'
      },
      {
        label: 'DIY Craft',
        prompt:
          'A colorful flat lay of craft supplies with a finished, vibrant project in the center. Text: "RAINBOW CRAFTS"'
      },
      {
        label: 'Food Challenge',
        prompt:
          'A person with an exaggerated happy expression eating a giant, colorful dessert. Text: "CRAZIEST DESSERT EVER"'
      }
    ]
  }
}