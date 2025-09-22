/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import useStore from '../lib/store';
import { hideHistory, restoreFromHistory, deleteFromHistory, clearHistory } from '../lib/actions';
import modes from '../lib/modes';

const HistoryItem = ({ round }) => {
  const firstOutput = round.outputs.find(o => o.outputData && !o.gotError);

  return (
    <li className="history-item">
      {firstOutput && modes[firstOutput.outputMode]?.imageOutput && (
        <div className="history-item-preview">
          <img src={firstOutput.outputData} alt="Thumbnail preview" />
        </div>
      )}
      <div className="history-item-info">
        <p className="history-item-prompt" title={round.prompt}>{round.prompt}</p>
        <p className="history-item-date">
          {new Date(round.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="history-item-actions">
        <button className="iconButton" onClick={() => restoreFromHistory(round.id)}>
          <span className="icon">restore</span>
          <span className="tooltip">Restore</span>
        </button>
        <button className="iconButton" onClick={() => deleteFromHistory(round.id)}>
          <span className="icon">delete</span>
          <span className="tooltip">Delete</span>
        </button>
      </div>
    </li>
  );
};

export default function HistoryModal() {
  const history = useStore.use.history();

  return (
    <div className="fullscreen-overlay" onClick={hideHistory}>
      <div className="crop-modal history-modal" onClick={e => e.stopPropagation()}>
        <div className="history-header">
          <h3>Generation History</h3>
          <div className="history-header-actions">
            {history.length > 0 && (
              <button className="button minor" onClick={() => {
                if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
                  clearHistory();
                }
              }}>
                <span className="icon">delete_sweep</span> Clear All
              </button>
            )}
            <button className="iconButton close-button" onClick={hideHistory}>
              <span className="icon">close</span>
            </button>
          </div>
        </div>
        <div className="history-content">
          {history.length > 0 ? (
            <ul className="history-list">
              {history.map(round => (
                <HistoryItem key={round.id} round={round} />
              ))}
            </ul>
          ) : (
            <div className="history-empty">
              <p>
                Your history is empty.
                <br />
                When you're done with a session, click the 'Reset' button to save it here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
