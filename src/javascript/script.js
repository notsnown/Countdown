let timer;
let isRunning = false;
let totalTime = 0;
let remainingTime = 0;

const hoursSpan = document.createElement("span");
const minutesSpan = document.createElement("span");
const secondsSpan = document.createElement("span");

function createEditableSpan(span, maxValue) {
    span.setAttribute("contenteditable", "true");
    span.style.outline = "none";
    span.style.textAlign = "center";

    span.addEventListener("input", () => {
        let value = span.textContent.replace(/\D/g, ""); // Remove caracteres não numéricos
        if (value.length > 2) value = value.slice(-2); // Mantém no máximo 2 dígitos
        
        let numericValue = parseInt(value) || 0;
        if (numericValue > maxValue) numericValue = maxValue; // Limita ao valor máximo

        span.textContent = String(numericValue).padStart(2, "0");
    });

    span.addEventListener("blur", () => {
        let numericValue = parseInt(span.textContent) || 0;
        span.textContent = String(numericValue).padStart(2, "0"); // Garante sempre 2 dígitos
    });

    span.addEventListener("focus", () => {
        document.execCommand("selectAll", false, null); // Seleciona todo o conteúdo ao clicar
    });
}

createEditableSpan(hoursSpan, 23);
createEditableSpan(minutesSpan, 59);
createEditableSpan(secondsSpan, 59);

hoursSpan.textContent = "00";
minutesSpan.textContent = "00";
secondsSpan.textContent = "00";

document.getElementById("time").innerHTML = "";
document.getElementById("time").appendChild(hoursSpan);
document.getElementById("time").appendChild(document.createTextNode(" : "));
document.getElementById("time").appendChild(minutesSpan);
document.getElementById("time").appendChild(document.createTextNode(" : "));
document.getElementById("time").appendChild(secondsSpan);

function getTimeFromSpans() {
    return (
        parseInt(hoursSpan.textContent) * 3600 +
        parseInt(minutesSpan.textContent) * 60 +
        parseInt(secondsSpan.textContent)
    );
}

function updateDisplay(time) {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    hoursSpan.textContent = hours;
    minutesSpan.textContent = minutes;
    secondsSpan.textContent = seconds;
}

document.getElementById("start").addEventListener("click", () => {
    if (isRunning) {
        clearInterval(timer);
        document.getElementById("start").innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
        totalTime = getTimeFromSpans();
        remainingTime = totalTime;
        timer = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updateDisplay(remainingTime);
            } else {
                clearInterval(timer);
                isRunning = false;
                document.getElementById("start").innerHTML = '<i class="fa-solid fa-play"></i>';
            }
        }, 1000);
        document.getElementById("start").innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
    isRunning = !isRunning;
});

document.getElementById("reset").addEventListener("click", () => {
    clearInterval(timer);
    isRunning = false;
    document.getElementById("start").innerHTML = '<i class="fa-solid fa-play"></i>';
    hoursSpan.textContent = "00";
    minutesSpan.textContent = "00";
    secondsSpan.textContent = "00";
    remainingTime = 0;
    totalTime = 0;
    document.getElementById("mark-list").innerHTML = "";
});

document.getElementById("mark").addEventListener("click", () => {
    if (remainingTime === 0) return; // Impede marcação se o tempo for zero

    const markItem = document.createElement("p");
    markItem.textContent = `Marca ${document.getElementById("mark-list").children.length + 1}: ${hoursSpan.textContent} : ${minutesSpan.textContent} : ${secondsSpan.textContent}`;
    document.getElementById("mark-list").appendChild(markItem);

    // Ajusta a altura da div CLOCK dinamicamente
    document.querySelector(".CLOCK").style.height = `${200 + document.getElementById("mark-list").children.length * 20}px`;
});

// Exibir ou esconder a div de edição
document.getElementById("edit").addEventListener("click", () => {
    const editContainer = document.getElementById("edit-time-container");
    editContainer.classList.toggle("hidden");
});

// Atualizar o timer ao confirmar a edição
document.getElementById("confirm-edit").addEventListener("click", () => {
    const hoursInput = document.getElementById("edit-hours").value || "0";
    const minutesInput = document.getElementById("edit-minutes").value || "0";
    const secondsInput = document.getElementById("edit-seconds").value || "0";

    const newHours = String(Math.min(23, parseInt(hoursInput))).padStart(2, "0");
    const newMinutes = String(Math.min(59, parseInt(minutesInput))).padStart(2, "0");
    const newSeconds = String(Math.min(59, parseInt(secondsInput))).padStart(2, "0");

    // Atualiza os spans do timer
    hoursSpan.textContent = newHours;
    minutesSpan.textContent = newMinutes;
    secondsSpan.textContent = newSeconds;

    // Esconder a div novamente
    document.getElementById("edit-time-container").classList.add("hidden");
});

// Cancelar edição
document.getElementById("cancel-edit").addEventListener("click", () => {
    document.getElementById("edit-time-container").classList.add("hidden");
    document.getElementById("edit-hours").value = "";
    document.getElementById("edit-minutes").value = "";
    document.getElementById("edit-seconds").value = "";
});

function validateTimeInput(event, maxValue) {
    let value = event.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (value.length > 2) value = value.slice(-2); // Permite apenas 2 dígitos
    if (parseInt(value) > maxValue) value = maxValue; // Limita ao máximo permitido

    event.target.value = value; // Atualiza o valor no input
}

// Aplica validação em tempo real para cada campo
document.getElementById("edit-hours").addEventListener("input", (e) => validateTimeInput(e, 23));
document.getElementById("edit-minutes").addEventListener("input", (e) => validateTimeInput(e, 59));
document.getElementById("edit-seconds").addEventListener("input", (e) => validateTimeInput(e, 59));

updateDisplay(remainingTime);