/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {limitFunction} from 'p-limit'

export const llmGen = limitFunction(
  async ({model, prompt, image}) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, prompt, image }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  },
  {concurrency: 3}
)
