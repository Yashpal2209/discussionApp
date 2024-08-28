function getQuestionId(){
    const storageKey="_questionCount";
    const currId=parseInt(localStorage.getItem(storageKey)||"1");

    localStorage.setItem(storageKey,currId+1);
    return currId;

}

function saveQuestionToStorage(question){
    let questions=getQuestionFromStorage();
    questions.push(question);
    localStorage.setItem("questions",JSON.stringify(questions));
}

function getQuestionFromStorage(){

    let questions=localStorage.getItem('questions');
    if(questions){
        questions=JSON.parse(questions);
    }else{
        questions=[];
    }
    return questions;
}

function deleteQuestionFromStorage(id){
    let questions=getQuestionFromStorage();
    let index=questions.findIndex(question=>question.id===id);
    if(index>-1){
        questions.splice(index,1);
        localStorage.setItem("questions",JSON.stringify(questions));
    }
}


function deleteQuestionFromUi(id){
    const question=document.querySelector(`.question_container[data-id="${id}"]`);
    console.log(question);
    if(question){
        question.remove();
    }
}

