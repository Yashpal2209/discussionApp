let questionList=document.getElementById("questionList");
let questionDetailContainer=document.getElementById('questionDetailContainer');
let createNewQuestion=document.getElementById('createNewQuestion');
let newQuestionform=document.getElementById('newQuestion');
let questioninfo=document.getElementById('questionInfo');
let ansid = localStorage.getItem("ansid") || 0;
function addQuestion(questionDetails) {
    const questionId=getQuestionId();
    
    const question={
        title:questionDetails.title,
        description:questionDetails.description,
        id:questionId,
        createdAt:new Date().getTime(),
        isResolved:false,
        acceptedAnswerId:0,
        answers:[],
        important:false
    }
    
    saveQuestionToStorage(question);
    displayQuestionOnUi(question);
    
    
}


function displayQuestionOnUi(question){
    const questionContainer=document.createElement("div");
    questionContainer.classList.add("question_container");
    questionContainer.setAttribute('data-id',question.id);
    const starIcon = document.createElement('i');
    starIcon.className = `fas fa-star star-icon ${question.important ? 'important' : ''}`;
    starIcon.addEventListener('click', (event) => {
        deleteQuestionFromUi(question.id);
        event.stopPropagation();
        if(starIcon.classList.contains('important')){
            // starIcon.classList.add('');
            starIcon.classList.remove('important');
            question.important=false;
            questionList.appendChild(questionContainer);
            // questionContainer.classList.remove('important');
        }else{  
            // console.log(question.important);
            console.log("hello");
            starIcon.classList.add('important');
            // starIcon.classList.remove('');
            question.important=true;
            questionList.prepend(questionContainer);
            // console.log(question.important);
            // questionContainer.classList.add('important');
            
        }
        const questions=getQuestionFromStorage();
        questions.forEach((question1)=>{
            if(question1.id===question.id){
                question1.important=question.important;
            }
        });

        localStorage.setItem('questions',JSON.stringify(questions));

        
    });
    const title=document.createElement('h3');
    const description=document.createElement('p');
    // const upvote=document.createElement('label');
    // const downvote=document.createElement('label');
    const createdAt=document.createElement('p');
    
    title.innerText=question.title;
    description.innerText=question.description;
    createdAt.innerHTML=formatTimestamp(question.createdAt);
    // upvote.innerText=question.upvotes;
    // downvote.innerText=question.downvotes;
    // questionContainer.appendChild(checkbox);
    questionContainer.appendChild(starIcon);
    questionContainer.appendChild(title);
    questionContainer.appendChild(description);
    
    // questionContainer.appendChild(upvote);
    // questionContainer.appendChild(document.createElement('br'));
    // questionContainer.appendChild(downvote);
    questionContainer.appendChild(createdAt);
    
    questionList.appendChild(questionContainer);
    questionContainer.addEventListener('click',function(){
        selectQuestion(question);
    })
}

const formatTimestamp=(timestamp)=>{
    let now=new Date().getTime();
    let diff=now-timestamp;

    let seconds=Math.floor(diff/1000);
    let minutes=Math.floor(seconds/60);
    let hours=Math.floor(minutes/60);
    let days=Math.floor(hours/24);

    if(days>0){
        return `${days} days ago`;
    }else if(hours>0){
        return `${hours} hours ago`;
    }else if(minutes>0){
        return `${minutes} minutes ago`;
    }else if(seconds>0){
        return `${seconds} seconds ago`;
    }

    return "a moment ago";
}

function selectQuestion(question){
    displayQuestionDetails(question);
}

function displayQuestionDetails(question){
    toggleDetailsSectionDisplay();
    showQuestionDetails(question);
}

function toggleDetailsSectionDisplay(){
    createNewQuestion.classList.add("hidden");
    // createNewQuestion.classList.add("questionDetailContainer");
    questionDetailContainer.classList.remove("hidden");
    document.getElementById("answersList").style.display="block";
    // createNewQuestion.classList.remove("createNewQuestion");
}

function showQuestionDetails(question){
    let questions=getQuestionFromStorage();

    questions.forEach((question1)=>{
        if(question1.id==question.id){
            questioninfo.innerHTML="";
            const h=document.createElement("h2");
            const questionContainer=document.createElement("div");
            questionContainer.classList.add("question_container");
            const title=document.createElement('h3');
            const description=document.createElement('p');
            const button=document.createElement("button");
            button.innerText="Resolve";
            button.classList.add("resolve");
            h.innerText="Question";
            title.innerText=question.title;
            description.innerText=question.description;
        
            
            questioninfo.appendChild(h);
            questionContainer.appendChild(title);
            questionContainer.appendChild(description);
            questioninfo.appendChild(questionContainer);
            button.addEventListener("click",()=>{
                deleteQuestionFromUi(question1.id);
                deleteQuestionFromStorage(question1.id);
                toggleagain();

            });
            questioninfo.appendChild(button);

            showAnswer(question1.id);

            const response=document.getElementById("submitResponse");
            response.addEventListener("click",()=>{
                saveAnswer(question1);
                showAnswer(question1.id);
            });
        }
    });
    
}

function saveAnswer(question1){
    let questions=getQuestionFromStorage();
    questions.forEach((question)=>{
        if(question.id==question1.id){
            let name=document.getElementById('name');
            let comment=document.getElementById('comment');
            if(name.value.trim()!="" && comment.value.trim!=""){
                const ans={
                    id:ansid++,
                    name:name.value,
                    comment:comment.value,
                    upvotes:0,
                    downvotes:0,
                }
                localStorage.setItem('ansid',ansid);
                question.answers.push(ans);
                name.value="";
                comment.value="";
            }
        }
    })
    localStorage.setItem('questions',JSON.stringify(questions));

 
}

newQuestionform.addEventListener('click',function(){
    toggleagain();
})

function toggleagain(){
    questionDetailContainer.classList.add("hidden");
    questionDetailContainer.classList.add("createNewQuestion");
    createNewQuestion.classList.remove("hidden");
    // questionDetailContainer.classList.remove("questionDetailContainer");
}

function filtertask(query){
    const tasks=document.querySelectorAll(`.question_container`);
    // console.log(tasks);
    let hasresult=false;

    tasks.forEach(task=>{
        // console.log(task);
        const h4=task.querySelector('h4');
        const text=h4.textContent.toLowerCase();
        const p=task.querySelector('p');
        const text2=p.textContent.toLowerCase();
        if(query===''){
            h4.innerHTML=h4.textContent;
            p.innerHTML=p.textContent;
        }
        else{
        const index=text.indexOf(query);
        // debugger;
        if(index!=-1){
            task.style.display="flex";
            task.style.flexDirection="column";
            hasresult=true;

            const originalText=h4.textContent;
            h4.innerHTML = `${originalText.substring(0, index)}<span class="highlight">${originalText.substring(index, index + query.length)}</span>${originalText.substring(index + query.length)}`;
        }else{
            task.style.display="none";
            h4.innerHTML=h4.textContent;
            const index1=text2.indexOf(query);
            if(index1!=-1){
                task.style.display="flex";
                task.style.flexDirection="column";
                hasresult=true;

                const originalText=p.textContent;
                p.innerHTML = `${originalText.substring(0, index1)}<span class="highlight">${originalText.substring(index1, index1 + query.length)}</span>${originalText.substring(index1 + query.length)}`;
            }else{
                task.style.display="none";
                p.innerHTML=p.textContent;
            }

        }

        }
        // if(text.includes(query)|| text2.includes(query)){
        //     task.style.display="flex";
        //     task.style.flexDirection="column";
        //     hasresult=true;
        // }else{
        //     task.style.display="none";
        // }
    });

    if(!hasresult){
        const parent=document.querySelector('.question_container');
        let noresultmessage=document.querySelector(`.no-result-message`);
        if(!noresultmessage){
            noresultmessage=document.createElement('p');
            noresultmessage.classList.add('no-result-message');
            noresultmessage.textContent="No results found";
            questionList.appendChild(noresultmessage);
        }
    }else{
        const noresultmessage=document.querySelector(`.no-result-message`);
        if(noresultmessage){
            noresultmessage.remove();
        }
    }
}

function sortAnswers(id){
    let questions=getQuestionFromStorage();
    questions.forEach((question)=>{
        if(question.id===id){
            question.answers.sort((a,b)=>(b.upvotes-b.downvotes)-(a.upvotes-a.downvotes));
            localStorage.setItem('questions',JSON.stringify(questions));
        }
    });
}

function showAnswer(id){
    let questions=getQuestionFromStorage();
    let answersdiv=document.getElementById('answersList');
    answersdiv.innerHTML="";
    let answers;
    questions.forEach((question)=>{
        if(question.id==id){
            answers=question.answers;
        }
    })

    answers.forEach((answer)=>{
        const answerContainer=document.createElement('div');
        const heading=document.createElement('h3');
        const comment=document.createElement('p');
        const votes=document.createElement('p');
        const span1=document.createElement('span');
        const span2=document.createElement('span');
        const likeIcon = document.createElement('i');
        likeIcon.className = 'fas fa-thumbs-up thumb-icon';
        likeIcon.classList.add('liked');

        const dislikeIcon = document.createElement('i');
        dislikeIcon.className = 'fas fa-thumbs-down thumb-icon';
        dislikeIcon.classList.add('disliked');
        // let upvote=document.createElement('button');
        // let downvote=document.createElement('button');
        // upvote.classList.add('upbutton');
        // downvote.classList.add('downbutton');
        // upvote.innerText="+";
        // downvote.innerText="-";
        heading.innerText=answer.name;
        comment.innerText=answer.comment;
        span1.innerText=answer.upvotes;
        span2.innerText=answer.downvotes;
        span1.classList.add('span1');
        span2.classList.add('span2');
        votes.appendChild(span1);
        votes.appendChild(span2);
        answerContainer.appendChild(heading);
        answerContainer.appendChild(comment);
    
        answerContainer.appendChild(votes);
        answerContainer.appendChild(likeIcon);
        answerContainer.appendChild(dislikeIcon);
        // answerContainer.appendChild(upvote);
        // answerContainer.appendChild(downvote);
        answerContainer.appendChild(document.createElement('br'));
        answerContainer.classList.add("answerContainer");
        answersdiv.append(answerContainer);

        likeIcon.addEventListener("click",()=>{
            answer.upvotes++;
            questions.forEach((ques1)=>{
                if(ques1.id==id){
                    ques1.answers=answers;
                    localStorage.setItem('questions',JSON.stringify(questions));
                }
            });
            sortAnswers(id)
            showAnswer(id);
        });

        dislikeIcon.addEventListener("click",()=>{
            answer.downvotes++;
            questions.forEach((ques1)=>{
                if(ques1.id==id){
                    ques1.answers=answers;
                    localStorage.setItem('questions',JSON.stringify(questions));
                }
            });
            sortAnswers(id)
            showAnswer(id);
        });
        // upvote.addEventListener("click",()=>{
        //     answer.upvotes++;
        //     questions.forEach((ques1)=>{
        //         if(ques1.id==id){
        //             ques1.answers=answers;
        //             localStorage.setItem('questions',JSON.stringify(questions));
        //         }
        //     });
        //     sortAnswers(id)
        //     showAnswer(id);
                    
        // });
        // downvote.addEventListener("click",()=>{
        //     answer.downvotes++;
        //     questions.forEach((ques1)=>{
        //         if(ques1.id==id){
        //             ques1.answers=answers;
        //             localStorage.setItem('questions',JSON.stringify(questions));
        //         }
        //     });
        //     sortAnswers(id);
        //     showAnswer(id);
            
            
                    
                    
        // });


    })
}


