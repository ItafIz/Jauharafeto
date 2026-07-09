'use client';

import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, BookOpen, Calculator, CheckCircle2, ShieldAlert, Stethoscope, Users } from 'lucide-react';
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

const patientHighlights = [
  'Memahami tanda bahaya tanpa istilah yang membingungkan',
  'Mengenali kapan perlu kontrol terjadwal dan kapan harus segera ke IGD',
  'Membantu menyiapkan pertanyaan sebelum konsultasi dokter',
];

const clinicianHighlights = [
  'Ringkasan faktor risiko dan indikasi rujukan fetomaternal',
  'Kalkulator cepat untuk mendukung edukasi dan triase awal',
  'Materi edukasi pasien yang mudah dibagikan saat ANC',
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

      <section className="section grid lg:grid-cols-[1.08fr_.92fr] gap-10 items-center !pt-10">
        <div>
          <span className="badge">Edukasi kehamilan risiko tinggi • Fetomaternal</span>
          <h1 className="mt-5 text-4xl md:text-6xl font-black leading-tight text-pink-950">
            Pendamping digital untuk memahami risiko kehamilan lebih awal.
          </h1>
          <p className="mt-5 text-lg text-slate-700 leading-relaxed">
            JauharaFeto membantu pasien dan tenaga medis melakukan edukasi, perhitungan dasar, dan skrining awal fetomaternal dengan bahasa yang tenang, jelas, dan aman secara medis.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/pasien">Mulai untuk Pasien</Link>
            <Link className="btn btn-soft" href="/kalkulator">Buka Kalkulator</Link>
            <Link className="btn btn-soft" href="/medis">Area Tenaga Medis</Link>
          </div>
          <p className="mt-5 text-sm text-slate-500">
            Catatan: hasil skrining bukan diagnosis. Untuk keluhan, tanda bahaya, atau kehamilan risiko tinggi, tetap perlu pemeriksaan langsung oleh dokter.
          </p>
        </div>

        <div className="glass card p-7 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-200/60" />
          <div className="relative">
            <p className="text-sm font-bold text-pink-800">Fokus utama</p>
            <h2 className="mt-2 text-2xl font-black text-pink-950">Edukasi yang mudah dipahami, tetap klinis.</h2>
            <div className="mt-6 grid gap-4">
              {[
                ['Usia kehamilan & HPL', 'Estimasi berdasarkan HPHT untuk orientasi awal.', Calculator],
                ['BMI dan tekanan darah', 'Membantu mengenali parameter dasar saat ANC.', Activity],
                ['Skrining preeklampsia', 'Checklist faktor risiko yang perlu dibahas dengan dokter.', ShieldAlert],
                ['Materi edukasi', 'Topik fetomaternal disusun ringkas untuk pasien.', BookOpen],
              ].map(([title, desc, Icon]: any) => (
                <div key={title} className="rounded-2xl bg-white p-5 border border-pink-100 flex gap-4">
                  <Icon className="text-pink-700 shrink-0" />
                  <div>
                    <p className="font-bold">{title}</p>
                    <p className="text-sm text-slate-600 mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section !pt-2">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            ['Untuk pasien', 'Informasi praktis agar ibu hamil lebih siap saat kontrol dan paham tanda bahaya.', Users],
            ['Untuk tenaga medis', 'Ringkasan klinis dan materi edukasi yang dapat mendukung pelayanan ANC.', Stethoscope],
            ['Aman digunakan', 'Dirancang sebagai edukasi dan skrining awal, bukan pengganti diagnosis dokter.', CheckCircle2],
          ].map(([title, desc, Icon]: any) => (
            <div className="glass card" key={title}>
              <Icon className="text-pink-700" />
              <h3 className="font-black text-lg mt-3">{title}</h3>
              <p className="text-slate-700 mt-2 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="calculator" className="section">
        <div className="mb-8 max-w-3xl">
          <span className="badge">Kalkulator cepat</span>
          <h2 className="text-3xl font-black mt-3">Alat bantu orientasi awal</h2>
          <p className="mt-3 text-slate-700">Masukkan data dasar untuk membantu memahami usia kehamilan, BMI, dan MAP. Gunakan hasilnya sebagai bahan diskusi saat konsultasi.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="glass card"><h3 className="font-black text-xl mb-4">Usia Kehamilan & HPL</h3><label className="label">HPHT</label><input className="input mt-1" type="date" value={lmp} onChange={e=>setLmp(e.target.value)} />{ga && <div className="mt-4 ok card"><b>{ga.weeks} minggu {ga.days} hari</b><br/>HPL: {addDays(lmp, 280)}<br/>Trimester: {ga.weeks < 14 ? '1' : ga.weeks < 28 ? '2' : '3'}</div>}</div>
          <div className="glass card"><h3 className="font-black text-xl mb-4">BMI</h3><label className="label">Tinggi badan (cm)</label><input className="input mt-1 mb-3" value={height} onChange={e=>setHeight(e.target.value)} inputMode="decimal"/><label className="label">Berat badan (kg)</label><input className="input mt-1" value={weight} onChange={e=>setWeight(e.target.value)} inputMode="decimal"/>{bmi && <div className="mt-4 ok card"><b>BMI {bmi.value}</b><br/>Kategori: {bmi.category}</div>}</div>
          <div className="glass card"><h3 className="font-black text-xl mb-4">MAP</h3><label className="label">Sistolik</label><input className="input mt-1 mb-3" value={sys} onChange={e=>setSys(e.target.value)} inputMode="numeric"/><label className="label">Diastolik</label><input className="input mt-1" value={dia} onChange={e=>setDia(e.target.value)} inputMode="numeric"/>{map && <div className="mt-4 warn card"><b>MAP {map} mmHg</b><br/>Rumus: (S + 2×D) / 3</div>}</div>
        </div>
      </section>

      <section id="pasien" className="section grid lg:grid-cols-2 gap-6">
        <div className="glass card"><div className="flex gap-3 items-center"><Users className="text-pink-700"/><h2 className="text-2xl font-black">Ruang Pasien</h2></div><p className="mt-3 text-slate-700">Edukasi dengan bahasa sederhana agar ibu dan keluarga lebih percaya diri memahami kehamilan.</p><ul className="mt-4 space-y-2">{patientHighlights.map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="text-pink-700 shrink-0" size={20}/><span>{item}</span></li>)}</ul></div>
        <div id="medis" className="glass card"><div className="flex gap-3 items-center"><Stethoscope className="text-pink-700"/><h2 className="text-2xl font-black">Ruang Tenaga Medis</h2></div><p className="mt-3 text-slate-700">Dukungan edukasi, checklist, dan ringkasan untuk komunikasi klinis yang lebih efektif.</p><ul className="mt-4 space-y-2">{clinicianHighlights.map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="text-pink-700 shrink-0" size={20}/><span>{item}</span></li>)}</ul></div>
      </section>

      <section className="section">
        <div className="glass card"><h2 className="text-2xl font-black mb-2 flex gap-2"><ShieldAlert className="text-pink-700"/>Skrining Awal Preeklampsia</h2><p className="mb-5 text-slate-700">Jawab beberapa faktor risiko berikut. Bila ada jawaban “Ya”, gunakan hasil ini sebagai pengingat untuk berdiskusi dengan dokter saat kontrol.</p><div className="grid md:grid-cols-2 gap-3">{riskQuestions.map((q,i)=><div key={q} className="bg-white rounded-2xl border border-pink-100 p-4"><p className="font-semibold">{q}</p><div className="mt-3 flex gap-2"><button className={`btn ${answers[i]==='yes'?'btn-primary':'btn-soft'}`} onClick={()=>setAnswers({...answers,[i]:'yes'})}>Ya</button><button className={`btn ${answers[i]==='no'?'btn-primary':'btn-soft'}`} onClick={()=>setAnswers({...answers,[i]:'no'})}>Tidak</button></div></div>)}</div><div className={`mt-5 card ${risk.cls}`}><b>{risk.label}</b><br/>Faktor “ya”: {risk.yes}. Hasil ini bukan diagnosis dan tidak menggantikan pemeriksaan dokter.</div></div>
      </section>

      <section className="section">
        <div className="mb-8 max-w-3xl"><span className="badge">Edukasi</span><h2 className="text-3xl font-black mt-3">Topik fetomaternal pilihan</h2><p className="mt-3 text-slate-700">Materi awal untuk membantu pasien mengenali kondisi penting dan membantu tenaga medis menyampaikan edukasi dengan konsisten.</p></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{educationGroups.map(g=><div className="glass card" key={g.title}><BookOpen className="text-pink-700"/><h3 className="font-black text-lg mt-3">{g.title}</h3><ul className="mt-3 space-y-1 text-sm text-slate-700 list-disc pl-5">{g.items.map(i=><li key={i}>{i}</li>)}</ul></div>)}</div>
      </section>

      <section className="section !pt-0">
        <div className="warn card flex gap-3">
          <AlertTriangle className="shrink-0" />
          <p><b>Penting:</b> bila ada nyeri kepala hebat, pandangan kabur, nyeri ulu hati, perdarahan, kejang, sesak, demam tinggi, gerak janin berkurang, atau keluhan berat lain, segera ke IGD/fasilitas kesehatan terdekat.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

