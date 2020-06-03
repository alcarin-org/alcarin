import * as React from 'react';

export function LoginForm() {
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
        <div className="control">
          <button className="button is-link" type="submit">
            Zaloguj
          </button>
        </div>
      </div>
    </form>
  );
}
