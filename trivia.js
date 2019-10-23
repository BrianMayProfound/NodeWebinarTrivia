// test comment
function quizApp() {

  pjs.defineDisplay("display", "display.json");

  while (!exitBtn) {
    backBtn = false;
    goBtn = false;
    var token = pjs.sendRequest({  method: 'get', 
                                      uri: 'https://opentdb.com/api_token.php?command=request' });

    var categories = pjs.sendRequest({  method: 'get', 
                                      uri: 'https://opentdb.com/api_category.php' });
    choicesList = Array.prototype.map.call(categories.trivia_categories, s => s.name).toString();
    valuesList = Array.prototype.map.call(categories.trivia_categories, s => s.id).toString();
    
    display.main.execute();
    
    if(goBtn){
      if(selectedCategory==''){
        errorMsg = 'Please select a category';
      }
      else{
        var questions = pjs.sendRequest({  method: 'get', 
                                      uri: 'https://opentdb.com/api.php?amount=10&category=' + selectedCategory + '&token=' + token.token + '&encode=url3986' });
        if(questions == ''){
          errorMsg = 'Error Retrieving Questions';
        }
        else{
          correct = 0;
          var questionanswer = [];
          questions.results.some(function (question,index){
            show0 = show1 = show2 = show3 = 0;
            var correctIndex = Math.floor((Math.random() * question.incorrect_answers.length) + 1);
            var answers = question.incorrect_answers;
            answers.splice(correctIndex, 0, question.correct_answer);
            questionField = decodeURIComponent(question.question);
             if(answers[0]){
              answer0 = decodeURIComponent(answers[0]);
              show0 = true;
            }
            if(answers[1]){
              answer1 = decodeURIComponent(answers[1]);
              show1 = true;
            }
            if(answers[2]){
              answer2 = decodeURIComponent(answers[2]);
              show2 = true;
            }
            if(answers[3]){
              answer3 = decodeURIComponent(answers[3]);
              show3 = true;
            }

            display.question.execute();
            if(backBtn){
              return true;
            }
           questionanswer.push({"question":questionField,"answer":decodeURIComponent(question.correct_answer),"correct":response == correctIndex.toString()});
            if(response == correctIndex.toString()){
              correct++;
            }
          });
          if(!backBtn){
            switch (correct) {
              case 0:   
                imageName = 'public/images/sad.png';
                resultText = "You didn't get any correct!";
                break;
              case 3:
              case 2:
              case 1:    
                imageName = 'public/images/thumbsdown.png';          
                resultText = "Sorry you only got " + correct + " correct.";
                break; 
              case 6:
              case 5:
              case 4:
                imageName = 'public/images/welldone.png';
                resultText = "Pretty good. You got " + correct + " correct.";
                break; 
              case 10:
                imageName = 'public/images/greatJob.jpg';
                resultText = "Perfect Score!";
                break; 
              default:
                imageName = 'public/images/goodjob.png';
                resultText = "Good job! You got " + correct + " correct.";
            }
            display.results.execute();
             display.answers.replaceRecords(questionanswer);
             display.resultsList.execute();
          }
        }
      }
    }


  }
  function askQuestion(question,index){
    question = question.question;
    answer1 = question.correct_answer;
    // question.incorrect_answers.forEach(function(item,index){
    //   changeElelementValue('answer'+index,item);
    // });
    display.question.execute;
  }

}

exports.default = quizApp;