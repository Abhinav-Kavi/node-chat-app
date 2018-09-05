const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

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

describe('generateLocationMessage', ()=>{
  it("should return proper location message object", ()=>{
    let from = "Abhinav",
        latitude = 123,
        longitude = 445;

    let returnObject = generateLocationMessage(from,latitude,longitude);

    expect(returnObject.from).toBe(from);
    expect(returnObject.url).toBe(`https://www.google.com/maps?q=${latitude},${longitude}`);
    expect(typeof returnObject.createdAt).toBe("number");
  });
});