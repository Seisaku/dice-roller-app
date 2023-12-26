const { check } = require("yargs");


console.log("Starting index.js");

function roll(dices, faces) {
    let result = 0;
    for (var i = 0; i < dices; i++) {
        result += rollSingleDie(faces);
    }
    return result;
}

function rollReturnArray(dices, faces) {
    let result = [];
    let total = 0;
    for (var i = 0; i < dices; i++) {
        let dieResult = rollSingleDie(faces);
        total += dieResult;
        result.push(
            {
                result: dieResult
            }
        );
    }
    return {
        dices: dices,
        faces: faces,
        result: result,
        total: total
    };
}

function rollSingleDie(faces) {
    return (faces == 0) ? 0 : Math.floor(Math.random() * faces) + 1;
}

function rollTest(roll, test, goal) {
    let resultArray = roll.result;
    let successCounter = 0;
    let successTotal = 0;
    for (let index = 0; index < resultArray.length; index++) {
        const die = resultArray[index];
        switch (test) {
            case ">":
                evaluation = die.result > goal;
                break;
            case "<":
                evaluation = die.result < goal;
                break;
            case "=":
                evaluation = die.result == goal;
                break;
            case ">=":
                evaluation = die.result >= goal;
                break;
            case "<=":
                evaluation = die.result <= goal;
                break;
            case "!=":
                evaluation = die.result != goal;
                break;
            default:
                evaluation = die.result > goal;
        }
        die.matchesCondition = evaluation;
        if (evaluation) {
            successCounter++;
            successTotal += die.result;
        }
    }
    roll.successCounter = successCounter;
    roll.successTotal = successTotal;
    roll.test = test;
    roll.goal = goal;
    return roll;
}

function createTestFunction(test, goal) {
    switch (test) {
        case ">":
            return (num) => num > goal;
        case "<":
            return (num) => num < goal;
        case "=":
            return (num) => num == goal;
        case ">=":
            return (num) => num >= goal;
        case "<=":
            return (num) => num <= goal;
        case "!=":
            return (num) => num != goal;
        default:
            return (num) => num > goal;    
    }
}

function modifyRoll(roll, command, condition, goal) {

    roll.modCommand = command;
    roll.modCondition = condition;
    roll.modGoal = goal;

    switch(condition) {
            case "Max": 
                goal=Math.max.apply(Math, roll.result.map(function(o) { return o.result; }));
                break;
            case "Min":
                goal=Math.min.apply(Math, roll.result.map(function(o) { return o.result; }));
                break;           
    }

    let evaluation = createTestFunction(condition, goal);

    roll.originalResult = roll.result;

    let negate = command == "D" || command == "R";
    roll.result = roll.result.filter(die => negate ? !evaluation(die.result) : evaluation(die.result));

    roll.total = roll.result.reduce((a, b) => a + b.result, 0);

    if(command == "R") {
        let dicesReroll=roll.originalResult.filter(die => evaluation(die.result)).length;
        let faces = roll.faces;
        let newRoll = rollReturnArray(dicesReroll, faces);
        roll.result = roll.result.concat(newRoll.result);
        roll.total = roll.total + newRoll.total;
    }

    return roll;
}

function rollParse(rollText) {
    let regex = /(\d+)[dD](\d+)(([KDR])(([><=]+|!=)(\d+)|Max|Min))?(([><=]+|!=)(\d+))?/;
    let match = rollText.match(regex);

    if (match) {
        let dices = parseInt(match[1]);
        let faces = parseInt(match[2]);
        
        var roll = rollReturnArray(dices, faces);

        let altCommand = match[4];
        let altCondition = match[6];
        let altGoal = parseInt(match[7]);

        if (altCommand) {
            roll = modifyRoll(roll, altCommand, altCondition, altGoal);
        }

        let test = match[9];
        let goal = parseInt(match[10]);
        
        return rollTest(roll, test, goal);
    }
    else {
        return error = {
            error: "Invalid roll command [" + rollText + "]"
        };
    }
}

function describeRoll(roll) {
    let result = "";
    for (let index = 0; index < roll.result.length; index++) {
        const die = roll.result[index];
        result += die.result;
        if (index < roll.result.length - 1) {
            result += ", ";
        }
    }
    return result;
}

module.exports = { roll, rollParse };