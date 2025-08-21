/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const f = s =>
  s
    .replaceAll(/([^\n{])\n([^\n}\s+])/g, '$1 $2')
    .replaceAll(/\n{3,}/g, '\n\n')
    .trim()

const baseInstruction = `You are an expert graphic designer creating a 16:9 YouTube thumbnail. The final image must be professional, high-resolution, and visually compelling. Key requirements are: 1) A clear, engaging subject. 2) Large, bold, and easily readable text that is a core part of the design. 3) A dynamic composition that draws the viewer's eye. The specific art style is:`

export default {
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
      ${baseInstruction} hyper-realistic and cinematic. Emulate the look of a blockbuster film with dramatic, moody lighting and deep shadows. Apply professional color grading for a specific emotional tone (e.g., cool blues for sci-fi, warm tones for adventure). The composition should be dynamic, using rule of thirds, with a clear focal point. Text is integrated seamlessly into the scene.
    `),
    imageOutput: true,
    presets: [
      {
        label: 'Space Documentary',
        prompt:
          'A stunning photorealistic nebula with a futuristic spaceship flying through it. Text: "The Final Frontier"'
      },
      {
        label: 'Movie Review',
        prompt:
          'A dramatic split-screen of two photorealistic characters facing off. Text: "EPIC SHOWDOWN"'
      },
      {
        label: 'Travel Vlog',
        prompt:
          'A lone hiker watching a majestic, photorealistic sunset over mountains. Text: "My Greatest Adventure"'
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