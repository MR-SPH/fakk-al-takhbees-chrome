/* Arabic 101 <-> English US QWERTY keyboard-layout conversion. No translation. */
(() => {
  const normalUS = "`qwertyuiop[]asdfghjkl;'zxcvbnm,./";
  const normalAR = ["ذ","ض","ص","ث","ق","ف","غ","ع","ه","خ","ح","ج","د","ش","س","ي","ب","ل","ا","ت","ن","م","ك","ط","ئ","ء","ؤ","ر","لا","ى","ة","و","ز","ظ"];
  const shiftedUS = '~QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?';
  const shiftedAR = ["ّ","َ","ً","ُ","ٌ","لإ","إ","‘","÷","×","؛","<",">","ِ","ٍ","]","[","لأ","أ","ـ","،","/"," :",'"',"~","ْ","}","{","لآ","آ","’",",",".","؟"];
  const e2a = Object.create(null), a2e = Object.create(null), ligatures = Object.create(null);
  [...normalUS].forEach((key,i) => { const value=normalAR[i]; e2a[key]=value; (value.length>1?ligatures:a2e)[value]=key; });
  [...shiftedUS].forEach((key,i) => { const value=shiftedAR[i]; e2a[key]=value; (value.length>1?ligatures:a2e)[value]=key; });
  const keep = new Set([..."0123456789!@#$%^&*()-_=+\\|"]);
  function convert(input, toArabic, options={}) {
    const chars=[...String(input ?? "")]; let output="", ligaturesUsed=0; const unchanged=Object.create(null);
    const mark=c=>{ if(!keep.has(c)&&! /\s/u.test(c)) unchanged[c]=(unchanged[c]||0)+1; };
    for(let i=0;i<chars.length;i++) {
      const c=chars[i];
      if(toArabic) {
        let key=null;
        if(Object.hasOwn(e2a,c)) key=c;
        else if(/^[A-Z]$/.test(c)&&Object.hasOwn(e2a,c.toLowerCase())) key=c.toLowerCase();
        else if(Object.hasOwn(e2a,c.toLowerCase())) key=c.toLowerCase();
        else { const idx=shiftedUS.indexOf(c); if(idx>=0 && Object.hasOwn(e2a,normalUS[idx])) key=normalUS[idx]; }
        if(key!==null) output+=e2a[key]; else {output+=c;mark(c);}
      } else {
        const pair=c+(chars[i+1]||"");
        if(options.combineLamAlef!==false && Object.hasOwn(ligatures,pair)) {output+=ligatures[pair];i++;ligaturesUsed++;continue;}
        if(Object.hasOwn(a2e,c)) output+=a2e[c]; else {output+=c;mark(c);}
      }
    }
    return {text:output, unchanged, ligaturesUsed};
  }
  globalThis.FakkConverter={convert, keymap:{normalUS,normalAR,shiftedUS,shiftedAR}};
})();