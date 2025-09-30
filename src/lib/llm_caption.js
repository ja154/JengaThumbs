/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {limitFunction} from 'p-limit'

export default limitFunction(
  async ({prompt}) => {
    const response = await fetch('/api/generate_caption', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.caption;
  },
  {concurrency: 3}
)
