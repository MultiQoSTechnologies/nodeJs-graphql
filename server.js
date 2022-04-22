require('../GraphQL/src/connection/db');
const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const userModel = require("../GraphQL/src/models/use.model");

// Initialize a GraphQL schema
// For instance, you want to return a user and an array of users of type Person, who have an id, name, age, and their favorite shark properties.
const schema = buildSchema(`
  type Query {
    user(id: ID): Person 
    users(shark: String): [Person]  
  },
  type Person {
    id: ID
    name: String
    age: Int
    shark: String
  },
  
  type Mutation {
    createUser(name : String,age : Int,shark : String) : Person
    updateUser(id : ID,name : String,age : Int,shark : String) : Person
    deleteUser(id : ID) : [Person]
  } 
`);

// Create new user
let createUser = async function ({name, age, shark}) {
    try {
        const user = await new userModel();
        user.name = name;
        user.age = age;
        user.shark = shark;
        return await user.save();
    } catch (e) {
        console.log(e);
        return false;
    }
}

// Update a user and return new user details
let updateUser = async function ({id, name, age, shark}) {
    try {
        const updateUser = await userModel.findOne({_id: id});
        if (updateUser) {
            updateUser.name = name;
            updateUser.age = age;
            updateUser.shark = shark;
            return await updateUser.save();
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

// Delete user and return existing user details
let deleteUser = async function ({id}) {
    try {
        if (id) {
            let userExist = await userModel.findOneAndUpdate({_id: id}, {$set: {status: 3}}, {new: true});
            if (userExist) {
                const user = await userModel.find({status: 1});
                return user;
            }
        }
    } catch (e) {
        console.log(e);
        return false;
    }

}

// Return a single user (based on id)
let getSingleUser = async function ({id}) {
    try {
        if (id) {
            return await userModel.findOne({_id: id});
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

// Return a list of users (takes an optional shark parameter)
let retrieveUsers = async function ({shark}) {
    try {
        if (shark) {
            return userModel.find({shark: shark});
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

// Root resolver
let root = {
    user: getSingleUser,     // Resolver function to return user with specific id
    users: retrieveUsers,    //Resolver unction to return all users
    createUser: createUser,  //Resolver function for create user
    updateUser: updateUser, //Resolver function for update user
    deleteUser: deleteUser  //Resolver function for delete user
};

// Create an express server and a GraphQL endpoint
let app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,  // Must be provided
    rootValue: root,
    graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));