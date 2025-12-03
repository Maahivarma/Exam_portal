function tokenize(text){ return text.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(Boolean); }
function termFreq(tokens){ const tf={}; for(const t of tokens) tf[t]=(tf[t]||0)+1; const n=tokens.length||1; for(const k in tf) tf[k]=tf[k]/n; return tf; }
function idf(docs){ const N=docs.length; const df={}; docs.forEach(doc=>{ const seen=new Set(); doc.forEach(t=>{ if(!seen.has(t)){ df[t]=(df[t]||0)+1; seen.add(t);} }); }); const out={}; for(const k in df) out[k]=Math.log((N+1)/(df[k]+1))+1; return out; }
function dot(a,b){ let s=0; for(const k in a) if(b[k]) s+=a[k]*b[k]; return s; }
function norm(v){ let s=0; for(const k in v) s+=v[k]*v[k]; return Math.sqrt(s); }

export function scoreMCQ(questions, answers){
  let total=0, correct=0;
  for(const q of questions){
    if(q.type!=="mcq") continue;
    total++;
    const correctOpt = q.options.find(o=>!!o.correct);
    const user = answers[q.id];
    if(user && correctOpt && user===correctOpt.id) correct++;
  }
  return { total, correct, percent: total ? Math.round((correct/total)*10000)/100 : 0 };
}

export function scoreSubjective(question, studentText){
  const refs = question.reference_answers || [];
  if(!studentText || studentText.trim().length<3) return { score: 0, details: null };
  const refTokens = refs.map(r=>tokenize(r));
  const stTokens = tokenize(studentText);
  const all = refTokens.concat([stTokens]);
  const idfs = idf(all);
  const refVecs = refTokens.map(tokens=>{ const tf = termFreq(tokens); const vec = {}; for(const k in tf) vec[k] = tf[k]*(idfs[k]||1); return vec; });
  const stTf = termFreq(stTokens); const stVec = {}; for(const k in stTf) stVec[k]=stTf[k]*(idfs[k]||1);
  let maxSim=0;
  for(const rv of refVecs){
    const s = dot(rv, stVec) / ((norm(rv)||1)*(norm(stVec)||1));
    if(!isNaN(s) && s>maxSim) maxSim=s;
  }
  return { score: Math.min(100, Math.round(maxSim*10000)/100), details: { similarity: maxSim } };
}
