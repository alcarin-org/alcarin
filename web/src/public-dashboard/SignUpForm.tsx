import * as React from 'react';

export function SignUpForm() {
  return (
    <form id="login-form">
      <div className="field">
        <label className="label">Email</label>
        <div className="control">
          <input className="input" type="text" placeholder="Adres email" />
        </div>
      </div>

      <div className="field">
        <label className="label">Hasło</label>
        <div className="control">
          <input className="input" type="password" placeholder="Hasło" />
        </div>
      </div>

      <div className="field">
        <label className="label">Powtórz hasło</label>
        <div className="control">
          <input className="input" type="password" placeholder="Hasło" />
        </div>
      </div>

      <div className="field">
        <label className="label">Data urodzenia</label>
        <div className="control">
          <input
            className="input"
            type="date"
            placeholder="Data"
            min="1920-01-01"
          />
        </div>
      </div>

      <div className="field">
        <div className="control">
          <button className="button is-link" type="submit">
            Gotowe
          </button>
        </div>
      </div>
    </form>
  );
}
