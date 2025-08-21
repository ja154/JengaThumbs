/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const f = s =>
  s
    .replaceAll(/([^\n{])\n([^\n}\s+])/g, '$1 $2')
    .replaceAll(/\n{3,}/g, '\n\n')
    .trim()

export default {
  cinematic: {
    name: 'Cinematic',
    emoji: '🎬',
    syntax: 'image',
    systemInstruction: f(`
      Generate a professional, high-quality YouTube thumbnail with a 16:9 aspect ratio.
      The style should be cinematic, with dramatic lighting, high contrast, and a professional color grade.
      The composition should be visually appealing and draw the viewer's attention to the main subject.
      If text is included in the prompt, make it bold, clear, and easy to read.
      The overall mood should be epic and engaging.
    `),
    imageOutput: true,
    presets: [
      {
        label: 'Space Documentary',
        prompt:
          'A stunning nebula with a futuristic spaceship flying through it. Text: "The Final Frontier"'
      },
      {
        label: 'Movie Review',
        prompt:
          'A dramatic split-screen of two movie characters facing off. Text: "EPIC SHOWDOWN"'
      },
      {
        label: 'Travel Vlog',
        prompt:
          'A lone hiker watching a majestic sunset over mountains. Text: "My Greatest Adventure"'
      }
    ]
  },
  minimalist: {
    name: 'Minimalist',
    emoji: '✨',
    syntax: 'image',
    systemInstruction: f(`
      Generate a professional, clean YouTube thumbnail with a 16:9 aspect ratio.
      The style should be minimalist, using a simple color palette, plenty of negative space, and clean typography.
      Focus on a single, iconic visual element.
      Text should be elegant, sans-serif, and well-spaced.
      The overall aesthetic should be modern, stylish, and uncluttered.
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
    syntax: 'image',
    systemInstruction: f(`
      Generate a high-impact YouTube thumbnail with a 16:9 aspect ratio.
      The main focus should be large, bold, and easily readable text that grabs attention.
      Use a clean, modern, and impactful font.
      The background should be simple, using solid colors, subtle gradients, or abstract shapes that complement the text without distracting from it.
      The overall design must be professional, click-worthy, and text-centric.
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
    syntax: 'image',
    systemInstruction: f(`
      Generate a bright, eye-catching YouTube thumbnail with a 16:9 aspect ratio.
      Use a vibrant and saturated color palette to make the thumbnail pop.
      The imagery should be energetic and dynamic.
      Text should be fun, readable, and possibly outlined to stand out against the colorful background.
      The overall feel should be exciting, positive, and full of energy.
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