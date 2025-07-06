'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Técnico');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, phone, password, role }),
    });

    if (res.ok) {
      router.push('/login'); // redirige al login
    } else {
      const { message } = await res.json();
      setErrorMsg(message || 'Error al registrar usuario');
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: 450, margin: '0 auto' }}>
      <h2>Registro de Usuario</h2>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <form onSubmit={handleRegister}>
        <label>Nombre Completo:
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required />
        </label>

        <label>Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
        </label>

        <label>Teléfono:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)} />
        </label>

        <label>Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
        </label>

        <label>Rol:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Admin">Admin</option>
            <option value="Técnico">Técnico</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Vendedor">Vendedor</option>
          </select>
        </label>

        <button type="submit">Registrar</button>
      </form>
    </main>
  );
}
