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
      <section className="hero">
        <div className="heroContent">
          <div className="badge">Portal Nilai Siswa</div>
          <h1>Sistem Informasi Nilai TKA</h1>
          <p>
            Cek hasil TKA secara aman menggunakan NISN dan tanggal lahir yang
            sesuai dengan data sekolah.
          </p>

          <div className="steps" aria-label="Langkah cek nilai">
            <div className="step"><b>1</b><span>Masukkan NISN</span></div>
            <div className="step"><b>2</b><span>Isi tanggal lahir</span></div>
            <div className="step"><b>3</b><span>Lihat nilai</span></div>
          </div>
        </div>

        <section className="card">
          <div className="logo">
            <h2>Cek Nilai TKA</h2>
            <p>Login menggunakan data siswa</p>
          </div>

          <form onSubmit={cekNilai}>
            <label htmlFor="nisn">NISN</label>
            <input
              id="nisn"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={nisn}
              onChange={(e) => setNisn(e.target.value.replace(/\D/g, ''))}
              placeholder="Contoh: 0012345678"
              required
            />

            <label htmlFor="ttl">Tanggal Lahir</label>
            <input id="ttl" type="date" value={ttl} onChange={(e) => setTtl(e.target.value)} required />

            <button type="submit" disabled={loading}>
              {loading && <span className="spinner" aria-hidden="true" />}
              {loading ? 'Memeriksa...' : 'Masuk & Cek Nilai'}
            </button>
          </form>

          {error && <div className="error">{error}</div>}

          {result && (
            <div className="hasil">
              <div className="success">✓ Data berhasil ditemukan</div>
              <h3>{result.nama}</h3>
              <span className="nisnBadge">NISN {result.nisn}</span>
              <div className="scoreGrid">
                <div className="scoreCard"><span>Matematika</span><b>{result.mtk}</b></div>
                <div className="scoreCard"><span>Bahasa Indonesia</span><b>{result.indo}</b></div>
              </div>
            </div>
          )}

          <div className="footer">Sistem Informasi Nilai TKA<br />Mirroring by DBS</div>
        </section>
      </section>
    </main>
  );
}
