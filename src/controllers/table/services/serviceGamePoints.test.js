require("@jest/globals");

var serviceGamePoints = require("./serviceGamePoints.js");

describe("TEST OF FUNCTION : serviceGamePoints ", () => {
  describe("Assessing coop computations", () => {
    describe("When coop 8 is won by 1 fold", () => {
      const coopWonby1 = {
        contract: "8plis",
        outcome: 1,
      };
      test("then the attack win points", () => {
        let serviceResponse = serviceGamePoints(coopWonby1);
        expect(serviceResponse.attack).toBe(10);
      });
      test("then the defense win no points", () => {
        let serviceResponse = serviceGamePoints(coopWonby1);
        expect(serviceResponse.defense).toBe(0);
      });
    });
    describe("When coop 8 is won by 3 folds", () => {
      const coopWonby3 = {
        contract: "8plis",
        outcome: 3,
      };
      test("then the attack win points", () => {
        let serviceResponse = serviceGamePoints(coopWonby3);
        expect(serviceResponse.attack).toBe(16);
      });
      test("then the defense win no points", () => {
        let serviceResponse = serviceGamePoints(coopWonby3);
        expect(serviceResponse.defense).toBe(0);
      });
    });
    describe("When coop 8 is won with all folds", () => {
      const coopWonbyall = {
        contract: "8plis",
        outcome: 5,
      };
      test("then the attack win points", () => {
        let serviceResponse = serviceGamePoints(coopWonbyall);
        expect(serviceResponse.attack).toBe(30);
      });
      test("then the defense win no points", () => {
        let serviceResponse = serviceGamePoints(coopWonbyall);
        expect(serviceResponse.defense).toBe(0);
      });
    });
    describe("When coop 8 is lost by 1 fold", () => {
      const coopLostby1 = {
        contract: "8plis",
        outcome: -1,
      };
      test("then the defense win the points", () => {
        let serviceResponse = serviceGamePoints(coopLostby1);
        expect(serviceResponse.defense).toBe(10);
      });
      test("then the attack has opposite points", () => {
        let serviceResponse = serviceGamePoints(coopLostby1);
        expect(serviceResponse.attack).toBe(-10);
        expect(serviceResponse.attack).toBe(-serviceResponse.defense);
      });
    });
    describe("When coop 8 is lost by 3 folds", () => {
      const coopLostby3 = {
        contract: "8plis",
        outcome: -3,
      };
      test("then the defense win the points", () => {
        let serviceResponse = serviceGamePoints(coopLostby3);
        expect(serviceResponse.defense).toBe(16);
      });
      test("then the attack has opposite points", () => {
        let serviceResponse = serviceGamePoints(coopLostby3);
        expect(serviceResponse.attack).toBe(-16);
        expect(serviceResponse.attack).toBe(-serviceResponse.defense);
      });
    });
  });
  describe("Assessing solo computations", () => {
    describe("When solo 7 is won by 1 fold", () => {
      const solo7Wonby1 = {
        contract: "solo7",
        outcome: 1,
      };
      test("then the attack win points", () => {
        let serviceResponse = serviceGamePoints(solo7Wonby1);
        expect(serviceResponse.attack).toBe(18);
      });
      test("then the defense win no points", () => {
        let serviceResponse = serviceGamePoints(solo7Wonby1);
        expect(serviceResponse.defense).toBe(0);
      });
    });
    describe("When solo 7 is won by 3 fold", () => {
      const solo7Wonby3 = {
        contract: "solo7",
        outcome: 3,
      };
      test("then the attack points are capped", () => {
        let serviceResponse = serviceGamePoints(solo7Wonby3);
        expect(serviceResponse.attack).toBe(18);
      });
    });
    describe("When solo 7 is lost by 1 fold", () => {
      const solo7Lostby1 = {
        contract: "solo7",
        outcome: -1,
      };
      test("then the defense points are 2/3rd of the attack", () => {
        let serviceResponse = serviceGamePoints(solo7Lostby1);
        expect(serviceResponse.defense).toBe(12);
        expect(serviceResponse.defense).toBe((-2 / 3) * serviceResponse.attack);
      });
      test("then the attack has regular malus", () => {
        let serviceResponse = serviceGamePoints(solo7Lostby1);
        expect(serviceResponse.attack).toBe(-18);
      });
    });
    describe("When solo 7 is lost by 3 folds", () => {
      const solo7Lostby3 = {
        contract: "solo7",
        outcome: -3,
      };
      test("then the defense points are 2/3rd of the attack", () => {
        let serviceResponse = serviceGamePoints(solo7Lostby3);
        expect(serviceResponse.defense).toBe(16);
        expect(serviceResponse.defense).toBe((-2 / 3) * serviceResponse.attack);
      });
      test("then the attack has regular malus", () => {
        let serviceResponse = serviceGamePoints(solo7Lostby3);
        expect(serviceResponse.attack).toBe(-24);
      });
    });
    describe.skip("When piccolo is lost", () => {
      const piccoloLostby3 = {
        contract: "piccolo",
        outcome: -3,
      };
      test("then the defense points are 2/3rd of the attack", () => {
        let serviceResponse = serviceGamePoints(piccoloLostby3);
        expect(serviceResponse.defense).toBe(16);
        expect(serviceResponse.defense).toBe((-2 / 3) * serviceResponse.attack);
      });
      test("then the attack malus is capped", () => {
        let serviceResponse = serviceGamePoints(piccoloLostby3);
        expect(serviceResponse.attack).toBe(-24);
      });
    });
  });
  describe("Assessing fixed contract computations", () => {
    describe("When petite misere is won", () => {
      const petitemisereWon = {
        contract: "petitemisere",
        outcome: 0,
      };
      test("then the attack win points", () => {
        let serviceResponse = serviceGamePoints(petitemisereWon);
        expect(serviceResponse.attack).toBe(18);
      });
      test("then the defense win no points", () => {
        let serviceResponse = serviceGamePoints(petitemisereWon);
        expect(serviceResponse.defense).toBe(0);
      });
    });
    describe("When petite misere is lost", () => {
      const petitemisereLost = {
        contract: "petitemisere",
        outcome: -1,
      };
      test("then the attack lose points", () => {
        let serviceResponse = serviceGamePoints(petitemisereLost);
        expect(serviceResponse.attack).toBe(-18);
      });
      test("then the defense recieves defense points", () => {
        let serviceResponse = serviceGamePoints(petitemisereLost);
        expect(serviceResponse.defense).toBe(12);
      });
    });
    describe("When grande misere is won", () => {
      const grandemisereWon = {
        contract: "grandemisere",
        outcome: 0,
      };
      test("then the attack win points", () => {
        let serviceResponse = serviceGamePoints(grandemisereWon);
        expect(serviceResponse.attack).toBe(36);
      });
      test("then the defense win no points", () => {
        let serviceResponse = serviceGamePoints(grandemisereWon);
        expect(serviceResponse.defense).toBe(0);
      });
    });
    describe("When grande misere is lost", () => {
      const grandemisereLost = {
        contract: "grandemisere",
        outcome: -1,
      };
      test("then the attack lose points", () => {
        let serviceResponse = serviceGamePoints(grandemisereLost);
        expect(serviceResponse.attack).toBe(-36);
      });
      test("then the defense recieves defense points", () => {
        let serviceResponse = serviceGamePoints(grandemisereLost);
        expect(serviceResponse.defense).toBe(24);
      });
    });
    describe("When grande misere etalee is won", () => {
      const grandemisereetaleeWon = {
        contract: "grandemisereetalee",
        outcome: 0,
      };
      test("then the attack win points", () => {
        let serviceResponse = serviceGamePoints(grandemisereetaleeWon);
        expect(serviceResponse.attack).toBe(75);
      });
      test("then the defense win no points", () => {
        let serviceResponse = serviceGamePoints(grandemisereetaleeWon);
        expect(serviceResponse.defense).toBe(0);
      });
    });
    describe("When grande misere etalee is lost", () => {
      const grandemisereetaleeLost = {
        contract: "grandemisereetalee",
        outcome: -1,
      };
      test("then the attack lose points", () => {
        let serviceResponse = serviceGamePoints(grandemisereetaleeLost);
        expect(serviceResponse.attack).toBe(-75);
      });
      test("then the defense recieves defense points", () => {
        let serviceResponse = serviceGamePoints(grandemisereetaleeLost);
        expect(serviceResponse.defense).toBe(32);
      });
    });
  });
  describe("Assessing trou computations", () => {
    describe("When trou is won", () => {
      const trouWon = {
        contract: "trou8",
        outcome: 0,
      };
      test("then the attack win points", () => {
        let serviceResponse = serviceGamePoints(trouWon);
        expect(serviceResponse.attack).toBe(16);
      });
      test("then the defense win no points", () => {
        let serviceResponse = serviceGamePoints(trouWon);
        expect(serviceResponse.defense).toBe(0);
      });
    });
    describe("When trou is won with all folds", () => {
      const trouWon = {
        contract: "trou8",
        outcome: 5,
      };
      test("then the attack win more points", () => {
        let serviceResponse = serviceGamePoints(trouWon);
        expect(serviceResponse.attack).toBe(30);
      });
    });
    describe("When petite misere is lost", () => {
      const trouLost = {
        contract: "trou8",
        outcome: -1,
      };
      test("then the attack lose no points", () => {
        let serviceResponse = serviceGamePoints(trouLost);
        expect(serviceResponse.attack).toBe(0);
      });
      test("then the defense recieves defense points", () => {
        let serviceResponse = serviceGamePoints(trouLost);
        expect(serviceResponse.defense).toBe(16);
      });
    });
  });
});
