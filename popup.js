const $=id=>document.getElementById(id);
const input=$("input"), output=$("output"), status=$("status"), combine=$("combine");
let direction=true;
function run(toArabic){direction=toArabic;const result=FakkConverter.convert(input.value,toArabic,{combineLamAlef:combine.checked});output.value=result.text;output.dir=toArabic?"rtl":"ltr";status.textContent=result.ligaturesUsed?("تم التعامل مع "+result.ligaturesUsed+" من تراكيب لام-ألف كمفتاح واحد."): "";chrome.storage.local.set({lastInput:input.value,lastOutput:output.value,direction,combine:combine.checked});}
$("toArabic").addEventListener("click",()=>run(true));
$("toEnglish").addEventListener("click",()=>run(false));
$("clear").addEventListener("click",()=>{input.value="";output.value="";status.textContent="";input.focus();});
$("swap").addEventListener("click",()=>{input.value=output.value;output.value="";input.focus();});
$("copy").addEventListener("click",async()=>{if(!output.value)return;try{await navigator.clipboard.writeText(output.value);status.textContent="تم نسخ النتيجة."; }catch{output.focus();output.select();status.textContent="تعذّر النسخ التلقائي؛ انسخ النص المحدد يدويًا.";}});
combine.addEventListener("change",()=>chrome.storage.local.set({combine:combine.checked}));
chrome.storage.local.get(["lastInput","lastOutput","direction","combine"],data=>{input.value=data.lastInput||"";output.value=data.lastOutput||"";direction=data.direction!==false;combine.checked=data.combine!==false;});