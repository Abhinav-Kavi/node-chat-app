const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', ()=>{
  it("should return proper message object", ()=>{
    let from = "Abhinav";
    let text = "Hey there !";

    let returnObject = generateMessage(from,text);

    expect(returnObject.from).toBe(from);
    expect(returnObject.text).toBe(text);
    expect(typeof returnObject.createdAt).toBe("number");
  });

});