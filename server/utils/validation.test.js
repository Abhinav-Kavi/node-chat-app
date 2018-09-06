const expect = require('expect');

const {isRealString} = require("./validation");

describe('isRealString', ()=>{
  it("should return true for a valid string", ()=>{
    
    let input = "test";
    let returnValue = isRealString(input);

    expect(typeof returnValue).toBe("boolean");
    expect(returnValue).toBe(true);
  });

  it("should return false for a non-string input", ()=>{
    
    let input = 233;
    let returnValue = isRealString(input);

    expect(typeof returnValue).toBe("boolean");
    expect(returnValue).toBe(false);
  });

  it("should return false for a string with only spaces", ()=>{
    
    let input = "     ";
    let returnValue = isRealString(input);

    expect(typeof returnValue).toBe("boolean");
    expect(returnValue).toBe(false);
  });
});