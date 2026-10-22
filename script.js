const RATING_LABELS = {1:"Needs improvement",2:"Fair",3:"Good",4:"Very good",5:"Outstanding"};
const ratings = {session1:0,session2:0,session3:0,overall:0};
document.querySelectorAll(".stars[data-rating]").forEach(group=>{
  const key=group.dataset.rating;
  for(let n=1;n<=5;n++){
    const b=document.createElement("button");
    b.type="button";b.className="star-button";b.textContent="★";
    b.setAttribute("aria-label",`${n} out of 5 stars`);b.setAttribute("aria-pressed","false");
    b.addEventListener("click",()=>setRating(key,n));
    b.addEventListener("mouseenter",()=>paintStars(group,n,true));
    b.addEventListener("focus",()=>paintStars(group,n,true));
    group.appendChild(b);
  }
  group.addEventListener("mouseleave",()=>paintStars(group,ratings[key],false));
  group.addEventListener("blur",e=>{if(!group.contains(e.relatedTarget))paintStars(group,ratings[key],false)},true);
});
function paintStars(group,value,hover){
  [...group.querySelectorAll("button")].forEach((b,i)=>{
    b.classList.toggle("active",i<value&&!hover);
    b.classList.toggle("hovered",i<value&&hover);
    b.setAttribute("aria-pressed",String(i+1===ratings[group.dataset.rating]));
  });
}
function setRating(key,value){
  ratings[key]=value;
  const group=document.querySelector(`.stars[data-rating="${key}"]`);
  paintStars(group,value,false);
  const caption=document.querySelector(`[data-caption="${key}"]`);
  if(caption)caption.textContent=`${value}/5 · ${RATING_LABELS[value]}`;
}
const overallComment=document.getElementById("overallComment");
overallComment.addEventListener("input",()=>document.getElementById("charCount").textContent=overallComment.value.length);
const msg=document.getElementById("formMessage");
function showMessage(text,type){msg.textContent=text;msg.className=`form-message ${type}`;msg.scrollIntoView({behavior:"smooth",block:"nearest"});}
function getConfig(){return window.APP_CONFIG||{};}
document.getElementById("feedbackForm").addEventListener("submit",async e=>{
  e.preventDefault();msg.className="form-message";msg.textContent="";
  const missing=["session1","session2","session3","overall"].filter(k=>!ratings[k]);
  if(missing.length){showMessage("Please select a star rating for all three sessions and the overall workshop before submitting.", "error");document.querySelector(`[data-rating="${missing[0]}"]`).scrollIntoView({behavior:"smooth",block:"center"});return;}
  if(!overallComment.value.trim()){showMessage("Please add your overall feedback before submitting.","error");overallComment.focus();return;}
  if(!document.getElementById("consent").checked){showMessage("Please confirm the feedback storage notice to continue.","error");return;}
  const config=getConfig();
  if(!config.supabaseUrl||!config.supabaseAnonKey||config.supabaseUrl.includes("YOUR_PROJECT")||config.supabaseAnonKey.includes("YOUR_SUPABASE")){
    showMessage("The form is ready, but the database is not connected yet. Follow SETUP.md to add your Supabase URL and publishable key, then run the SQL setup. No feedback has been sent or saved.","error");return;
  }
  if(!window.supabase){showMessage("The database client could not load. Check your internet connection and try again.","error");return;}
  const button=document.getElementById("submitButton");button.disabled=true;button.innerHTML="Submitting…";
  try{
    const client=window.supabase.createClient(config.supabaseUrl,config.supabaseAnonKey);
    const payload={
      participant_name:document.getElementById("participantName").value.trim()||null,
      college_name:document.getElementById("collegeName").value.trim(),
      department:document.getElementById("department").value,
      year_of_study:document.getElementById("yearOfStudy").value||null,
      participant_role:document.getElementById("role").value||null,
      email:document.getElementById("email").value.trim()||null,
      session1_rating:ratings.session1,session1_comment:document.getElementById("comment1").value.trim()||null,
      session2_rating:ratings.session2,session2_comment:document.getElementById("comment2").value.trim()||null,
      session3_rating:ratings.session3,session3_comment:document.getElementById("comment3").value.trim()||null,
      overall_rating:ratings.overall,overall_comment:overallComment.value.trim(),
      recommend:document.getElementById("recommend").value||null
    };
    const {error}=await client.from("workshop_feedback").insert(payload);
    if(error)throw error;
    document.getElementById("feedbackForm").reset();
    Object.keys(ratings).forEach(k=>{ratings[k]=0;paintStars(document.querySelector(`.stars[data-rating="${k}"]`),0,false);const c=document.querySelector(`[data-caption="${k}"]`);if(c)c.textContent=k==="overall"?"Choose your overall rating":"Choose a rating";});
    document.getElementById("charCount").textContent="0";
    showMessage("Thank you! Your feedback has been submitted successfully. Your response will help improve future PowerFlow AI workshops.","success");
  }catch(err){
    console.error("Feedback submission error:",err);
    showMessage("We couldn't save your feedback. Please check your connection or try again later. If this continues, contact the workshop organiser.","error");
  }finally{button.disabled=false;button.innerHTML='Submit feedback <span>↗</span>';}
});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.08});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
