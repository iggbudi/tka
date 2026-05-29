import { readFileSync, writeFileSync } from 'node:fs';

const input = process.argv[2] || 'C:/Users/huawei/Downloads/website_cek_nilai_tka.html';
const output = process.argv[3] || '.env.local';
const html = readFileSync(input, 'utf8');
const match = html.match(/const\s+dataSiswa\s*=\s*(\[[\s\S]*?\]);/);

if (!match) {
  console.error('dataSiswa tidak ditemukan.');
  process.exit(1);
}

const data = JSON.parse(match[1]).filter((s) => s.nisn && s.ttl && s.nama && s.nisn !== 'None');
const json = JSON.stringify(data);
writeFileSync(output, `TKA_DATA_JSON=${json}\n`);
console.log(`Berhasil menulis ${data.length} data ke ${output}`);
