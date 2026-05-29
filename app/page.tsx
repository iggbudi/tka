'use client';

import { FormEvent, useState } from 'react';

type Result = {
  nama: string;
  nisn: string;
  mtk: string;
  indo: string;
};

export default function Home() {
  const [nisn, setNisn] = useState('');
  const [ttl, setTtl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  async function cekNilai(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/cek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nisn, ttl }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.message || 'NISN atau tanggal lahir tidak ditemukan.');
        return;
      }

      setResult(data.siswa);
    } catch {
      setError('Gagal menghubungi server. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="card">
        <div className="logo">
          <h1>Cek Nilai TKA</h1>
          <p>Login menggunakan NISN dan tanggal lahir</p>
        </div>

        <form onSubmit={cekNilai}>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={nisn}
            onChange={(e) => setNisn(e.target.value.replace(/\D/g, ''))}
            placeholder="Masukkan NISN"
            required
          />
          <input type="date" value={ttl} onChange={(e) => setTtl(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? 'Memeriksa...' : 'Masuk & Cek Nilai'}</button>
        </form>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="hasil">
            <div className="item"><span>Nama</span><b>{result.nama}</b></div>
            <div className="item"><span>NISN</span><b>{result.nisn}</b></div>
            <div className="item"><span>Matematika</span><b>{result.mtk}</b></div>
            <div className="item"><span>Bahasa Indonesia</span><b>{result.indo}</b></div>
          </div>
        )}

        <div className="footer">Sistem Informasi Nilai TKA<br />Mirroring by DBS</div>
      </section>
    </main>
  );
}
