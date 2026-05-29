import { NextRequest, NextResponse } from 'next/server';

type Siswa = {
  nisn: string;
  ttl: string;
  nama: string;
  mtk: string;
  indo: string;
};

export const dynamic = 'force-dynamic';

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function getData(): Siswa[] {
  let raw = process.env.TKA_DATA_JSON?.trim();
  if (!raw) throw new Error('TKA_DATA_JSON belum di-set di Environment Variables Vercel.');

  // Antisipasi jika user menyalin satu baris penuh dari .env.local:
  // TKA_DATA_JSON='[...]'
  if (raw.startsWith('TKA_DATA_JSON=')) raw = raw.slice('TKA_DATA_JSON='.length).trim();
  if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) {
    raw = raw.slice(1, -1);
  }

  const parsed = JSON.parse(raw) as Siswa[];
  return parsed.filter((s) => s.nisn && s.ttl && s.nama && s.nisn !== 'None');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null) as { nisn?: unknown; ttl?: unknown } | null;
    const nisn = String(body?.nisn ?? '').trim();
    const ttl = String(body?.ttl ?? '').trim();

    if (!/^\d{8,12}$/.test(nisn) || !/^\d{4}-\d{2}-\d{2}$/.test(ttl)) {
      return jsonResponse({ ok: false, message: 'Format NISN atau tanggal lahir tidak valid.' }, 400);
    }

    const siswa = getData().find((item) => item.nisn === nisn && item.ttl === ttl);
    if (!siswa) {
      // Pesan sengaja dibuat umum agar tidak membocorkan apakah NISN valid.
      return jsonResponse({ ok: false, message: 'Data tidak ditemukan.' }, 404);
    }

    return jsonResponse({
      ok: true,
      siswa: {
        nama: siswa.nama,
        nisn: siswa.nisn,
        mtk: siswa.mtk,
        indo: siswa.indo,
      },
    });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, message: 'Server belum terkonfigurasi.' }, 500);
  }
}

export function GET() {
  return jsonResponse({ ok: false, message: 'Method tidak diizinkan.' }, 405);
}
