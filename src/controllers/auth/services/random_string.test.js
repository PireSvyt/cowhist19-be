require("@jest/globals");

var random_string = require("./random_string.js");

describe("TEST OF FUNCTION : random_string ", () => {
  // Length input check
  describe("Assessment of input length", () => {
    describe("When length input is given", () => {
      test("then length of random string is 8", () => {
        let randomstring = random_string(8);
        expect(randomstring.length).toEqual(8);
      });
      test("then length of random string is 12", () => {
        let randomstring = random_string(12);
        expect(randomstring.length).toEqual(12);
      });
      test("then length of random string is 0", () => {
        let randomstring = random_string(0);
        expect(randomstring.length).toEqual(0);
      });
    });
  });
  // Random aspect check
  describe("Assessment of randomization", () => {
    describe("When 20 random strings are built", () => {
      test("they are all unique", () => {
        let randomstringlist = [];
        for (let i = 0; i < 19; i++) {
          randomstringlist.push(random_string(20));
        }
        randomstringlist.forEach((randomstring) => {
          expect(
            randomstringlist.filter((s) => s === randomstring).length
          ).toEqual(1);
        });
      });
    });
  });
});
