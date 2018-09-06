const expect = require("expect");

const {Users} = require("./users");



describe("Users", ()=>{
  let test_UsersObj;

  beforeEach(()=>{
    test_UsersObj = new Users();
    test_UsersObj.users = [
      {
        id : "1",
        name: "Abhi",
        room: "Coders"
      },
      {
        id : "2",
        name: "Ravi",
        room: "Coders-2"
      },
      {
        id : "3",
        name: "Ram",
        room: "Coders"
      }
    ];
  });

  it("should add a user",()=>{
   
    let user = {
      id : "4",
      name: "Raju",
      room: "Coders"
    };

    let returnValue = test_UsersObj.addUser(user.id,user.name,user.room);

    expect(returnValue).toEqual(user);
    expect(test_UsersObj.users.length).toBe(4);
    expect(test_UsersObj.users[test_UsersObj.users.length-1]).toEqual(user);
  });

  it("should remove a user",()=>{
   
    let user =  test_UsersObj.users[0];
    let returnValue = test_UsersObj.removeUser(user.id);

    expect(returnValue).toEqual(user);
    expect(test_UsersObj.users.length).toBe(2);
    expect(test_UsersObj.users[0]).not.toEqual(user);
  });

  it("should not remove a user",()=>{
   
    let returnValue = test_UsersObj.removeUser(45);

    expect(returnValue).toBeFalsy();
    expect(test_UsersObj.users.length).toBe(3);
  });


  it("should get a user",()=>{
   
    let user =  test_UsersObj.users[0];
    let returnValue = test_UsersObj.getUser(user.id);

    expect(returnValue).toEqual(user);
  });

  it("should not get a user",()=>{
    let returnValue = test_UsersObj.getUser(453);
    expect(returnValue).toBeFalsy();
  });

  it("should get a user name list in Coders room",()=>{
    let returnValue = test_UsersObj.getUserList("Coders"); 
    expect(returnValue).toEqual(["Abhi","Ram"]);
  });

  it("should get a user name list in Coders-2 room",()=>{
    let returnValue = test_UsersObj.getUserList("Coders-2"); 
    expect(returnValue).toEqual(["Ravi"]);
  });

});


