let questionTitle=document.getElementById('questionTitle');
let quesdescription=document.getElementById('questionDescription');
let submitQuestion=document.getElementById('submitQuestion');
let searchInput=document.getElementById('search');

submitQuestion.addEventListener('click',function(event){
    let title=questionTitle.value;
    let description=quesdescription.value;
    if(title.trim()!="" && description.trim()!=""){
        addQuestion({title:title,description:description});
    }else{
        alert("Please enter question title and description");
    }
    
    questionTitle.value="";
    quesdescription.value="";
});

const questions=getQuestionFromStorage();
questions.forEach((question)=>{
    if(question.important){
        displayQuestionOnUi(question);
    }
});
questions.forEach(function(question){
    if(!question.important){
        displayQuestionOnUi(question);
    }
});


searchInput.addEventListener('keyup',function(event){
    
    let query=searchInput.value.toLowerCase();
    filtertask(query);  
    // console.log(query);
});
