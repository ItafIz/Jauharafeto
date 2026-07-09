'use client';

import { useMemo, useState } from 'react';
import { Activity, Baby, BookOpen, Calculator, HeartPulse, ShieldAlert, Stethoscope, Users } from 'lucide-react';
import Link from 'next/link';
import { Nav, Footer } from './components';
import { educationGroups } from './data';

type RiskAnswer = 'yes' | 'no';

const riskQuestions = [
  'Riwayat preeklampsia sebelumnya',
  'Hipertensi kronis',
  'Diabetes sebelum hamil',
  'Penyakit ginjal',
  'Lupus/autoimun/APS',
  'Kehamilan kembar',
  'Hamil pertama',
  'Usia ibu ≥35 tahun',
  'BMI ≥30',
  'Riwayat keluarga preeklampsia',
];

function diffWeeks(from: string) {
  if (!from) return null;
  const lmp = new Date(`${from}T00:00:00`);
  if (Number.isNaN(lmp.getTime())) return null;
  const today = new Date();
  const days = Math.floor((today.getTime() - lmp.getTime()) / 86400000);
  if (days < 0) return null;
  return { weeks: Math.floor(days / 7), days: days % 7, totalDays: days };
}

function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function Home() {
  const [lmp, setLmp] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');
  const [answers, setAnswers] = useState<Record<number, RiskAnswer>>({});

  const ga = useMemo(() => diffWeeks(lmp), [lmp]);
  const bmi = useMemo(() => {
    const h = Number(height) / 100;
    const w = Number(weight);
    if (!h || !w) return null;
    const value = w / (h * h);
    const category = value < 18.5 ? 'Underweight' : value < 25 ? 'Normal' : value < 30 ? 'Overweight' : 'Obesitas';
    return { value: value.toFixed(1), category };
  }, [height, weight]);
  const map = useMemo(() => {
    const s = Number(sys), d = Number(dia);
    if (!s || !d) return null;
    return ((s + 2 * d) / 3).toFixed(1);
  }, [sys, dia]);
  const risk = useMemo(() => {
    const yes = Object.values(answers).filter((v) => v === 'yes').length;
    const highRisk = [0, 1, 2, 3, 4, 5].some((i) => answers[i] === 'yes');
    if (highRisk || yes >= 3) return { label: 'Risiko tinggi / perlu evaluasi dokter', cls: 'danger', yes };
    if (yes >= 1) return { label: 'Perlu perhatian dan konsultasi saat ANC', cls: 'warn', yes };
    return { label: 'Risiko rendah berdasarkan jawaban saat ini', cls: 'ok', yes };
  }, [answers]);

  return (
    <main>
      <Nav />

      <section className="section grid lg:grid-cols-2 gap-10 items-center !pt-10">
        <div>
          <span className="badge">Sahabat Edukasi dan Skrining Fetomaternal</span>
          <h1 className="mt-5 text-4xl md:text-6xl font-black leading-tight text-pink-950">Pahami risiko kehamilan lebih awal.</h1>
          <p className="mt-5 text-lg text-slate-700">Platform edukasi, kalkulator, dan skrining awal fetomaternal untuk pasien dan tenaga medis. Dibuat dengan bahasa pasien yang aman dan alur klinis yang ringkas.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link className="btn btn-primary" href="/pasien">Untuk Pasien</Link><Link className="btn btn-soft" href="/medis">Untuk Tenaga Medis</Link><Link className="btn btn-soft" href="/kalkulator">Kalkulator</Link></div>
        </div>
        <div className="glass card p-7">
          <div className="grid grid-cols-2 gap-4">
            {[['HPL & usia kehamilan', Calculator], ['BMI kehamilan', Activity], ['MAP', HeartPulse], ['Skrining preeklampsia', ShieldAlert]].map(([t, Icon]: any) => <div key={t} className="rounded-2xl bg-white p-5 border border-pink-100"><Icon className="text-pink-700"/><p className="font-bold mt-3">{t}</p></div>)}
          </div>
        </div>
      </section>

      <section id="calculator" className="section">
        <div className="mb-8"><span className="badge">Kalkulator MVP</span><h2 className="text-3xl font-black mt-3">Alat bantu cepat</h2></div>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="glass card"><h3 className="font-black text-xl mb-4">Usia Kehamilan & HPL</h3><label className="label">HPHT</label><input className="input mt-1" type="date" value={lmp} onChange={e=>setLmp(e.target.value)} />{ga && <div className="mt-4 ok card"><b>{ga.weeks} minggu {ga.days} hari</b><br/>HPL: {addDays(lmp, 280)}<br/>Trimester: {ga.weeks < 14 ? '1' : ga.weeks < 28 ? '2' : '3'}</div>}</div>
          <div className="glass card"><h3 className="font-black text-xl mb-4">BMI</h3><label className="label">Tinggi badan (cm)</label><input className="input mt-1 mb-3" value={height} onChange={e=>setHeight(e.target.value)} inputMode="decimal"/><label className="label">Berat badan (kg)</label><input className="input mt-1" value={weight} onChange={e=>setWeight(e.target.value)} inputMode="decimal"/>{bmi && <div className="mt-4 ok card"><b>BMI {bmi.value}</b><br/>Kategori: {bmi.category}</div>}</div>
          <div className="glass card"><h3 className="font-black text-xl mb-4">MAP</h3><label className="label">Sistolik</label><input className="input mt-1 mb-3" value={sys} onChange={e=>setSys(e.target.value)} inputMode="numeric"/><label className="label">Diastolik</label><input className="input mt-1" value={dia} onChange={e=>setDia(e.target.value)} inputMode="numeric"/>{map && <div className="mt-4 warn card"><b>MAP {map} mmHg</b><br/>Rumus: (S + 2×D) / 3</div>}</div>
        </div>
      </section>

      <section id="pasien" className="section grid lg:grid-cols-2 gap-6">
        <div className="glass card"><div className="flex gap-3 items-center"><Users className="text-pink-700"/><h2 className="text-2xl font-black">Mode Pasien</h2></div><p className="mt-3 text-slate-700">Bahasa sederhana untuk memahami risiko, tanda bahaya, dan kapan perlu ke fasilitas kesehatan.</p><ul className="mt-4 space-y-2 list-disc pl-5"><li>Tanda bahaya kehamilan</li><li>Edukasi preeklampsia dan kehamilan risiko tinggi</li><li>Penjelasan USG anomali dan tindakan fetal medicine</li></ul></div>
        <div id="medis" className="glass card"><div className="flex gap-3 items-center"><Stethoscope className="text-pink-700"/><h2 className="text-2xl font-black">Mode Tenaga Medis</h2></div><p className="mt-3 text-slate-700">Checklist klinis, indikasi rujukan fetomaternal, dan ringkasan topik obstetri kompleks.</p><ul className="mt-4 space-y-2 list-disc pl-5"><li>Skrining preeklampsia klinis</li><li>Checklist rujukan fetomaternal</li><li>Template edukasi dan tindak lanjut</li></ul></div>
      </section>

      <section className="section">
        <div className="glass card"><h2 className="text-2xl font-black mb-4 flex gap-2"><ShieldAlert className="text-pink-700"/>Skrining Awal Preeklampsia</h2><div className="grid md:grid-cols-2 gap-3">{riskQuestions.map((q,i)=><div key={q} className="bg-white rounded-2xl border border-pink-100 p-4"><p className="font-semibold">{q}</p><div className="mt-3 flex gap-2"><button className={`btn ${answers[i]==='yes'?'btn-primary':'btn-soft'}`} onClick={()=>setAnswers({...answers,[i]:'yes'})}>Ya</button><button className={`btn ${answers[i]==='no'?'btn-primary':'btn-soft'}`} onClick={()=>setAnswers({...answers,[i]:'no'})}>Tidak</button></div></div>)}</div><div className={`mt-5 card ${risk.cls}`}><b>{risk.label}</b><br/>Faktor “ya”: {risk.yes}. Hasil ini bukan diagnosis dan tidak menggantikan pemeriksaan dokter.</div></div>
      </section>

      <section className="section">
        <div className="mb-8"><span className="badge">Edukasi</span><h2 className="text-3xl font-black mt-3">Topik Fetomaternal</h2></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{educationGroups.map(g=><div className="glass card" key={g.title}><BookOpen className="text-pink-700"/><h3 className="font-black text-lg mt-3">{g.title}</h3><ul className="mt-3 space-y-1 text-sm text-slate-700 list-disc pl-5">{g.items.map(i=><li key={i}>{i}</li>)}</ul></div>)}</div>
      </section>

      <Footer />
    </main>
  );
}
