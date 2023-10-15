module.exports = {
  adjustProbabilities: adjustProbabilities,
  pickOne: pickOne,
  random_id: random_id,
  getLastDates: getLastDates,
  objectGenerator: objectGenerator,
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

function objectGenerator(command) {
  if (command.count > 0) {
    let list = [];
    for (let i = 0; i < command.count; i++) {
      list.push(objectGenerator({ type: command.type }));
    }
    return list;
  } else {
    let rid = random_id(16);
    switch (command.type) {
      case "activated user":
        return {
          login: rid + "@yopmail.com",
          password: bcrypt.hashSync(rid, 10),
          pseudo: rid,
          status: "activated",
        };
      default:
        return undefined;
    }
  }
}
