let index = 0;

function loadQuestion() {
    const q = quizData[index];
    document.getElementById("question").innerText = q.question;

    const optionsBox = document.getElementById("options");
    optionsBox.innerHTML = "";

    q.options.forEach((option, i) => {
        let div = document.createElement("div");
        div.className = "option";
        div.innerText = option;
        div.onclick = () => checkAnswer(div, i);
        optionsBox.appendChild(div);
    });

    document.getElementById("next-btn").style.display = "none";
}

function checkAnswer(option, selected) {
    const q = quizData[index];

    if (selected === q.correct) option.classList.add("correct");
    else option.classList.add("wrong");

    document.querySelectorAll(".option").forEach(o => o.style.pointerEvents = "none");

    document.getElementById("next-btn").style.display = "block";
}

document.getElementById("next-btn").onclick = () => {
    index++;
    if (index >= quizData.length) {
        alert("🎉 Quiz Completed Successfully!");
        index = 0;
    }
    loadQuestion();
};

loadQuestion();