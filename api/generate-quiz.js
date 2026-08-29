export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 if(!process.env.ANTHROPIC_API_KEY)return res.status(503).json({error:'AI service is not configured. Add ANTHROPIC_API_KEY to your server environment.'});
 try{
  const{pdf,count=10}=req.body||{};if(!pdf)return res.status(400).json({error:'No PDF supplied.'});
  const n=Math.min(Math.max(Number(count)||10,3),30);
  const prompt=`Create exactly ${n} multiple-choice questions from the attached study PDF. Return ONLY valid JSON in this shape: {"questions":[{"question":"...","options":["...","...","...","..."],"correctIndex":0}]}. Make questions answerable from the document, avoid duplicates, and keep all four options plausible.`;
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:process.env.ANTHROPIC_MODEL||'claude-sonnet-4-6',max_tokens:6000,messages:[{role:'user',content:[{type:'document',source:{type:'base64',media_type:'application/pdf',data:pdf}},{type:'text',text:prompt}]}]})});
  if(!r.ok){console.error(await r.text());return res.status(502).json({error:'AI generation failed.'})}
  const data=await r.json(),raw=data.content?.[0]?.text||'',match=raw.match(/\{[\s\S]*\}/),parsed=JSON.parse(match?match[0]:raw);return res.status(200).json(parsed);
 }catch(error){console.error(error);return res.status(500).json({error:'Could not generate the quiz.'})}
}
