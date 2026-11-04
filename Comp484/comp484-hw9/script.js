// Part 1: Date Display

const currentDate = new Date();
const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
const currentDay = String(currentDate.getDate()).padStart(2, "0");
const currentYear = currentDate.getFullYear();

document.getElementById("dateOutput").textContent =
    `Today is ${currentMonth}/${currentDay}/${currentYear}`;


// Part 2 and Part 3: Dynamic Calculations

function updateCalculator() {
    // Get values from the number conversion inputs.
    const firstValueText = document.getElementById("firstValue").value;
    const secondValueText = document.getElementById("secondValue").value;
    const thirdValueText = document.getElementById("thirdValue").value;
    const fourthValueText = document.getElementById("fourthValue").value;

    // Convert the input values into numbers.
    const firstValueNumber = Number(firstValueText);
    const secondValueNumber = Number(secondValueText);
    const thirdValueNumber = Number(thirdValueText);
    const fourthValueNumber = Number(fourthValueText);

    // Conditional statement checking whether the first value is valid.
    let firstValueMessage;

    if (Number.isNaN(firstValueNumber)) {
        firstValueMessage = "This value is not a valid number.";
    } else {
        firstValueMessage = "This value is a valid number.";
    }

    // Conditional statement checking whether the second value is an integer.
    let secondValueMessage;

    if (Number.isInteger(secondValueNumber)) {
        secondValueMessage = "This value is an integer.";
    } else {
        secondValueMessage = "This value is not an integer.";
    }

    const numberConversionOutput = `
        <p>Original: "${firstValueText}" → Converted: ${firstValueNumber} → isNaN: ${Number.isNaN(firstValueNumber)} → isInteger: ${Number.isInteger(firstValueNumber)}</p>
        <p>${firstValueMessage}</p>

        <p>Original: "${secondValueText}" → Converted: ${secondValueNumber} → isNaN: ${Number.isNaN(secondValueNumber)} → isInteger: ${Number.isInteger(secondValueNumber)}</p>
        <p>${secondValueMessage}</p>

        <p>Original: "${thirdValueText}" → Converted: ${thirdValueNumber} → isNaN: ${Number.isNaN(thirdValueNumber)} → isInteger: ${Number.isInteger(thirdValueNumber)}</p>

        <p>Original: "${fourthValueText}" → Converted: ${fourthValueNumber} → isNaN: ${Number.isNaN(fourthValueNumber)} → isInteger: ${Number.isInteger(fourthValueNumber)}</p>
    `;

    document.getElementById("numberConversionOutput").innerHTML =
        numberConversionOutput;


    // Get the three grade inputs.
    const gradeOne = Number(document.getElementById("gradeOne").value);
    const gradeTwo = Number(document.getElementById("gradeTwo").value);
    const gradeThree = Number(document.getElementById("gradeThree").value);

    const mathOutputElement = document.getElementById("mathOutput");

    // Prevent grades greater than 100.
    if (gradeOne > 100 || gradeTwo > 100 || gradeThree > 100) {
        mathOutputElement.innerHTML = `
            <p class="error">
                Grades cannot be greater than 100.
                Please enter values between 0 and 100.
            </p>
        `;

        return;
    }

    // Perform arithmetic calculations.
    const totalPoints = gradeOne + gradeTwo + gradeThree;
    const gradeAverage = totalPoints / 3;
    const formattedAverage = gradeAverage.toFixed(2);

    // Display a passing or failing message.
    let performanceMessage;

    if (gradeAverage >= 70) {
        performanceMessage =
            "Passing: The student has an average of 70 or higher.";
    } else {
        performanceMessage =
            "Not passing: The student has an average below 70.";
    }

    mathOutputElement.innerHTML = `
        <p>Grade 1: ${gradeOne}</p>
        <p>Grade 2: ${gradeTwo}</p>
        <p>Grade 3: ${gradeThree}</p>
        <p>Total points: ${totalPoints}</p>
        <p>Average grade: ${formattedAverage}</p>
        <p>${performanceMessage}</p>
    `;
}


// Update results when the button is clicked.
document.getElementById("calculateButton").addEventListener(
    "click",
    updateCalculator
);


// Display default results when the page first loads.
updateCalculator();