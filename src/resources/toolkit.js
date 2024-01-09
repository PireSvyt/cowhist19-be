module.exports = {
  adjustProbabilities: adjustProbabilities,
  pickFromArray: pickFromArray,
  pickOne: pickOne,
  random_id: random_id,
  random_string: random_string,
  getLastDates: getLastDates,
};

function adjustProbabilities(dict, field) {
  // In case of array
  if (Array.isArray(dict)) {
    let arrayToDict = {};
    dict.forEach((item) => {
      arrayToDict[random_id()] = { ...item };
    });
    dict = arrayToDict;
  }
  // Find initial total propabilities
  let initialTotal = 0;
  Object.keys(dict).forEach((d) => {
    if (field !== undefined) {
      initialTotal += dict[d][field];
    } else {
      initialTotal += dict[d];
    }
  });
  let adjustedDict = {};
  if (initialTotal > 0.999 && initialTotal < 1.001) {
    // No need to adjust
    adjustedDict = dict;
  } else {
    // Adjust propabilities to reach 1
    Object.keys(dict).forEach((d) => {
      if (field !== undefined) {
        adjustedDict[d] = { ...dict[d] };
        adjustedDict[d][field] = dict[d][field] / initialTotal;
      } else {
        adjustedDict[d] = dict[d] / initialTotal;
      }
    });
  }
  return adjustedDict;
}

function pickFromArray(
  input,
  count = 1,
  mapping = (u) => {
    return u;
  },
) {
  let pickableList = input;
  let pickedList = [];
  let pickedItem = undefined;

  if (Array.isArray(input)) {
    // Pick
    if (input.length <= count) {
      pickedList = input;
    } else {
      for (let i = 1; i <= count; i++) {
        pickedItem = [Math.floor(Math.random() * pickableList.length)];
        pickedList.push(pickableList.splice(pickedItem, 1)[0]);
      }
    }

    // Map
    pickedList.map(mapping);

    // Result
    if (count === 1) {
      return pickedList[0];
    } else {
      return pickedList;
    }
  } else {
    console.log("pickFromArray input is not an array ", input);
    return undefined;
  }
}

function pickOne(input, field) {
  return Object.keys(input).find((el, i) => {
    const sum = Object.keys(input)
      .slice(0, i + 1)
      .reduce((acc, el) => {
        if (field !== undefined) {
          // In case a specific field holds the probability
          return acc + input[el][field];
        } else {
          return acc + input[el];
        }
      }, 0);
    if (Math.random() < sum) {
      return true;
    }
    return false;
  });
}

function random_id(length = 12) {
  return (temp_id = Math.random()
    .toString(2 * length)
    .substr(2, length));
}
function random_string(length = 24) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function getLastDates(days, weekdaysLikelihoods) {
  const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  var dateDict = {};
  var currentDate = new Date(Date.now());
  for (var d = 0; d > -days; d--) {
    let weekday = weekdays[currentDate.getDay()];
    if (weekdaysLikelihoods === undefined) {
      dateDict[random_id()] = {
        date: new Date(currentDate),
        weekday: weekday,
        likelihood: 1 / days,
      };
    } else {
      dateDict[random_id()] = {
        date: new Date(currentDate),
        weekday: weekday,
        likelihood: weekdaysLikelihoods[weekday],
      };
    }
    currentDate.setDate(currentDate.getDate() - 1);
  }
  return dateDict;
}
