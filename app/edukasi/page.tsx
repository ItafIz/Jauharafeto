import { Footer, Nav } from '../components';
import { educationGroups } from '../data';
import { BookOpen } from 'lucide-react';
export default function Edukasi(){return <main><Nav/><section className="section"><span className="badge">Edukasi</span><h1 className="text-4xl md:text-5xl font-black mt-4 text-pink-950">Pustaka topik fetomaternal</h1><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">{educationGroups.map(g=><div className="glass card" key={g.title}><BookOpen className="text-pink-700"/><h2 className="font-black text-xl mt-3">{g.title}</h2><ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-slate-700">{g.items.map(i=><li key={i}>{i}</li>)}</ul></div>)}</div></section><Footer/></main>}
