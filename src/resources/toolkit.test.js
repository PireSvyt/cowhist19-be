require("@jest/globals");

const { adjustProbabilities, pickOne, getLastDates } = require("./toolkit.js");

describe("TEST OF FUNCTION : adjustProbabilities ", () => {
  describe("When inputs are matching 100% probabilities", () => {
    // Distribution
    const dict = {
      mon: 0.0,
      tue: 0.2,
      wed: 0.3,
      thu: 0.5,
      fri: 0.0,
      sat: 0.0,
      sun: 0.0,
    };
    // Adjust distribution
    let adjustedDict = adjustProbabilities(dict);
    test("then propabilities remain unchanged", () => {
      expect(adjustedDict.mon).toBeCloseTo(dict.mon, 5);
      expect(adjustedDict.tue).toBeCloseTo(dict.tue, 5);
      expect(adjustedDict.wed).toBeCloseTo(dict.wed, 5);
      expect(adjustedDict.thu).toBeCloseTo(dict.thu, 5);
      expect(adjustedDict.fri).toBeCloseTo(dict.fri, 5);
      expect(adjustedDict.sat).toBeCloseTo(dict.sat, 5);
      expect(adjustedDict.sun).toBeCloseTo(dict.sun, 5);
    });
  });
  describe("When inputs do not match 100% probabilities", () => {
    // Distribution
    const dict = {
      mon: 0.0,
      tue: 2.0,
      wed: 3.0,
      thu: 5.0,
      fri: 0.0,
      sat: 0.0,
      sun: 0.0,
    };
    // Adjust distribution
    let adjustedDict = adjustProbabilities(dict);
    test("then propabilities are adjusted", () => {
      expect(adjustedDict.mon).toBeCloseTo(dict.mon / 10, 5);
      expect(adjustedDict.tue).toBeCloseTo(dict.tue / 10, 5);
      expect(adjustedDict.wed).toBeCloseTo(dict.wed / 10, 5);
      expect(adjustedDict.thu).toBeCloseTo(dict.thu / 10, 5);
      expect(adjustedDict.fri).toBeCloseTo(dict.fri / 10, 5);
      expect(adjustedDict.sat).toBeCloseTo(dict.sat / 10, 5);
      expect(adjustedDict.sun).toBeCloseTo(dict.sun / 10, 5);
    });
  });
  describe("When inputs do not match 100% probabilities with a specific field for probabilities", () => {
    // Distribution
    const toAdjustDict = {
      mon: { proba: 5 },
      tue: { proba: 15 },
      wed: { proba: 60 },
      thu: { proba: 15 },
      fri: { proba: 5 },
      sat: { proba: 0 },
      sun: { proba: 0 },
    };
    // Adjust distribution
    let adjustedDict = adjustProbabilities(toAdjustDict, "proba");
    test("then propabilities are adjusted", () => {
      expect(adjustedDict.mon.proba).toBeCloseTo(
        toAdjustDict.mon.proba / 100,
        5,
      );
      expect(adjustedDict.tue.proba).toBeCloseTo(
        toAdjustDict.tue.proba / 100,
        5,
      );
      expect(adjustedDict.wed.proba).toBeCloseTo(
        toAdjustDict.wed.proba / 100,
        5,
      );
      expect(adjustedDict.thu.proba).toBeCloseTo(
        toAdjustDict.thu.proba / 100,
        5,
      );
      expect(adjustedDict.fri.proba).toBeCloseTo(
        toAdjustDict.fri.proba / 100,
        5,
      );
      expect(adjustedDict.sat.proba).toBeCloseTo(
        toAdjustDict.sat.proba / 100,
        5,
      );
      expect(adjustedDict.sun.proba).toBeCloseTo(
        toAdjustDict.sun.proba / 100,
        5,
      );
    });
  });
});

describe("TEST OF FUNCTION : pickOne ", () => {
  describe("When inputs are biased", () => {
    // Distribution
    const dict = {
      mon: 0.0,
      tue: 0.0,
      wed: 1.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
      sun: 0.0,
    };
    let dictPicked = {
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
    };
    // Pick one from dict
    let shots = 5000;
    for (let i = 0; i < shots; i++) {
      let picked = pickOne(dict);
      dictPicked[picked] += 1 / shots;
    }
    test("then selection follows the distribution", () => {
      expect(dictPicked.mon).toBe(0);
      expect(dictPicked.tue).toBe(0);
      expect(dictPicked.wed).toBeCloseTo(1, 5);
      expect(dictPicked.thu).toBe(0);
      expect(dictPicked.fri).toBe(0);
      expect(dictPicked.sat).toBe(0);
      expect(dictPicked.sun).toBe(0);
    });
  });
  describe("When inputs come as a distribution", () => {
    // Distribution
    const dict = {
      mon: 0.05,
      tue: 0.15,
      wed: 0.6,
      thu: 0.15,
      fri: 0.05,
      sat: 0.0,
      sun: 0.0,
    };
    let dictPicked = {
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
    };
    // Pick one from dict
    let shots = 5000;
    for (let i = 0; i < shots; i++) {
      let picked = pickOne(dict);
      dictPicked[picked] += 1 / shots;
    }
    test("then selection still follows the distribution", () => {
      expect(dictPicked.mon).toBeCloseTo(dict.mon, 1);
      expect(dictPicked.tue).toBeCloseTo(dict.tue, 1);
      expect(dictPicked.wed).toBeCloseTo(dict.wed, 1);
      expect(dictPicked.thu).toBeCloseTo(dict.thu, 1);
      expect(dictPicked.fri).toBeCloseTo(dict.fri, 1);
      expect(dictPicked.sat).toBeCloseTo(dict.sat, 1);
      expect(dictPicked.sun).toBeCloseTo(dict.sun, 1);
    });
  });
  describe("When inputs come with a specific probability field", () => {
    // Distribution
    const dict = {
      mon: { proba: 0.05 },
      tue: { proba: 0.15 },
      wed: { proba: 0.6 },
      thu: { proba: 0.15 },
      fri: { proba: 0.05 },
      sat: { proba: 0.0 },
      sun: { proba: 0.0 },
    };
    let dictPicked = {
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
    };
    // Pick one from dict
    let shots = 5000;
    for (let i = 0; i < shots; i++) {
      let picked = pickOne(dict, "proba");
      dictPicked[picked] += 1 / shots;
    }
    test("then selection still follows the distribution", () => {
      expect(dictPicked.mon).toBeCloseTo(dict.mon.proba, 1);
      expect(dictPicked.tue).toBeCloseTo(dict.tue.proba, 1);
      expect(dictPicked.wed).toBeCloseTo(dict.wed.proba, 1);
      expect(dictPicked.thu).toBeCloseTo(dict.thu.proba, 1);
      expect(dictPicked.fri).toBeCloseTo(dict.fri.proba, 1);
      expect(dictPicked.sat).toBeCloseTo(dict.sat.proba, 1);
      expect(dictPicked.sun).toBeCloseTo(dict.sun.proba, 1);
    });
  });
});

describe("TEST OF FUNCTION : getLastDates ", () => {
  describe("When days are defined", () => {
    let dateDict = getLastDates(7);
    test("then the dates matches in number of days", () => {
      expect(Object.keys(dateDict).length).toBe(7);
    });
  });
  describe("When only days are defined", () => {
    let dateDict = getLastDates(7);
    let keys = Object.keys(dateDict);
    test("then distribution is homogeneous", () => {
      expect(dateDict[keys[0]].likelihood).toBeCloseTo(1 / 7, 5);
      expect(dateDict[keys[1]].likelihood).toBeCloseTo(1 / 7, 5);
      expect(dateDict[keys[2]].likelihood).toBeCloseTo(1 / 7, 5);
      expect(dateDict[keys[3]].likelihood).toBeCloseTo(1 / 7, 5);
      expect(dateDict[keys[4]].likelihood).toBeCloseTo(1 / 7, 5);
      expect(dateDict[keys[5]].likelihood).toBeCloseTo(1 / 7, 5);
      expect(dateDict[keys[6]].likelihood).toBeCloseTo(1 / 7, 5);
    });
  });
  describe("When days come with a specific likelihood", () => {
    test("then distribution follows the inputs", () => {
      let likelihoods = {
        mon: 0.025,
        tue: 0.1,
        wed: 0.8,
        thu: 0.1,
        fri: 0.025,
        sat: 0.0,
        sun: 0.0,
      };
      let dateDict = getLastDates(7, likelihoods);
      let monday = Object.keys(dateDict).find(
        (date) => dateDict[date].weekday === "mon",
      );
      let offset = Object.keys(dateDict).indexOf(monday);
      let keys = Object.keys(dateDict);
      expect(dateDict[keys[(offset - 0 + 7) % 7]].likelihood).toBeCloseTo(
        likelihoods.mon,
        5,
      );
      expect(dateDict[keys[(offset - 1 + 7) % 7]].likelihood).toBeCloseTo(
        likelihoods.tue,
        5,
      );
      expect(dateDict[keys[(offset - 2 + 7) % 7]].likelihood).toBeCloseTo(
        likelihoods.wed,
        5,
      );
      expect(dateDict[keys[(offset - 3 + 7) % 7]].likelihood).toBeCloseTo(
        likelihoods.thu,
        5,
      );
      expect(dateDict[keys[(offset - 4 + 7) % 7]].likelihood).toBeCloseTo(
        likelihoods.fri,
        5,
      );
      expect(dateDict[keys[(offset - 5 + 7) % 7]].likelihood).toBeCloseTo(
        likelihoods.sat,
        5,
      );
      expect(dateDict[keys[(offset - 6 + 7) % 7]].likelihood).toBeCloseTo(
        likelihoods.sun,
        5,
      );
    });
  });
});
